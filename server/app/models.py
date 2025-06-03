from datetime import datetime, timedelta, timezone
from enum import Enum

from sqlalchemy import Column, DateTime, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .extentions import bcrypt, db

user_roles = db.Table(
    "user_role",
    db.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),  # type: ignore
    Column("role_id", ForeignKey("roles.id"), primary_key=True),  # type: ignore
)


class BookingStatus(Enum):
    UPCOMING = "upcoming"
    ACTIVE = "active"
    COMPLETED = "completed"
    UNPAID = "unpaid"


class PaymentStatus(Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"


class User(db.Model):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True, nullable=False)
    email: Mapped[str] = mapped_column(unique=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(nullable=False)

    # Assuming many-to-many user_roles table exists
    roles: Mapped[list["Role"]] = relationship(
        secondary=user_roles, back_populates="users"
    )
    spaces: Mapped[list["Space"]] = relationship(back_populates="owner")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="user")
    payments: Mapped[list["Payment"]] = relationship(back_populates="client")
    agreements: Mapped[list["Agreement"]] = relationship(back_populates="client")

    serialize_only = (
        "id",
        "username",
        "email",
        "spaces.name",
        "spaces.availability",
    )

    @property
    def role_names(self):
        return [role.name for role in self.roles]

    @property
    def password(self):
        raise AttributeError("Password is write-only")

    @password.setter
    def password(self, password: str):
        self.hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")  # type: ignore

    def check_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.hashed_password, password)  # type:ignore

    def __repr__(self) -> str:
        return f"<User {self.username}>"


class Role(db.Model):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    serialize_only = ("id", "name", "users.name")

    users: Mapped[list["User"]] = relationship(
        secondary=user_roles, back_populates="roles"
    )

    def __repr__(self):
        return f"Role {self.name}"


class Space(db.Model):
    __tablename__ = "spaces"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship(back_populates="spaces")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="space")

    @property
    def availability(self):
        """
        Calculates the availability of the space based on active bookings
        and recent bookings with pending payments.
        """
        now = datetime.now(timezone.utc)  # Timezone-aware

        # Check if there's an active booking
        for booking in self.bookings:
            if booking.status == BookingStatus.ACTIVE:  # This line calls booking.status
                return False

            # If booking has a pending payment and was made within the last hour
            if (
                booking.status == BookingStatus.UPCOMING
            ):  # This line also calls booking.status
                payment_pending = (
                    booking.payment and booking.payment.status == PaymentStatus.PENDING
                )
                booking_created_at_aware = (
                    booking.created_at.astimezone(timezone.utc)
                    if booking.created_at.tzinfo is None
                    else booking.created_at
                )
                time_since_booking = now - booking_created_at_aware
                if payment_pending and time_since_booking <= timedelta(hours=1):
                    return False
        return True


class Booking(db.Model):
    __tablename__ = "bookings"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc)
    )
    name: Mapped[str] = mapped_column(unique=True)
    duration_hours: Mapped[int]

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    space_id: Mapped[int] = mapped_column(ForeignKey("spaces.id"))

    @property
    def status(self):
        now = datetime.now(timezone.utc)
        start = self.created_at
        if start.tzinfo is None:
            # Assuming the datetime stored in the DB was meant to be UTC if timezone=True
            start = start.replace(tzinfo=timezone.utc)

        end = start + timedelta(hours=self.duration_hours)
        if not self.payment or self.payment.status != PaymentStatus.PAID:
            return BookingStatus.UNPAID
        elif now < start:
            return BookingStatus.UPCOMING
        elif start <= now < end:
            return BookingStatus.ACTIVE
        else:
            return BookingStatus.COMPLETED

    user: Mapped["User"] = relationship(back_populates="bookings")
    space: Mapped["Space"] = relationship(back_populates="bookings")
    payment: Mapped["Payment"] = relationship(back_populates="booking")


class Agreement(db.Model):
    __tablename__ = "agreements"
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    signature: Mapped[str]

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    client: Mapped["User"] = relationship(back_populates="agreements")


class Payment(db.Model):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.now(timezone.utc)
    )
    status: Mapped[PaymentStatus] = mapped_column(default=PaymentStatus.PENDING)

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"))

    client: Mapped["User"] = relationship(back_populates="payments")
    booking: Mapped["Booking"] = relationship(back_populates="payment")
