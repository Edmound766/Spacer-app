from datetime import datetime, timedelta
from enum import Enum

from sqlalchemy import ForeignKey, DateTime, func, Column, Text, select
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy_serializer import SerializerMixin
from .extentions import db, bcrypt

user_roles = db.Table(
    "user_role",
    db.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("role_id", ForeignKey("roles.id"), primary_key=True),
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


class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(unique=True)
    email: Mapped[str] = mapped_column(unique=True)
    hashed_password: Mapped[bytes] = mapped_column(nullable=False)

    role: Mapped["Role"] = relationship(secondary=user_roles, back_populates="users")
    spaces: Mapped[set["Space"]] = relationship(back_populates="owner")
    bookings: Mapped[set["Booking"]] = relationship(back_populates="user")
    payments: Mapped[set["Payment"]] = relationship(back_populates="client")
    agreements: Mapped[set["Agreement"]] = relationship(back_populates="client")

    serialize_only = ("id", "username", "email", "role_name")

    @property
    def role_name(self):
        return self.role.name

    @property
    def password(self):
        raise AttributeError("Password is write only")

    @password.setter
    def password(self, password: str):
        print(f"password {password} has been set")
        hashed = bcrypt.generate_password_hash(password=password)
        self.hashed_password = hashed

    def check_password(self, password: str):
        pass_verified = bcrypt.check_password_hash(self.hashed_password, password)
        return pass_verified

    def __repr__(self) -> str:
        return f"User {self.username}"


class Role(db.Model, SerializerMixin):
    __tablename__ = "roles"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str]

    serialize_only = ("id", "name", "users.name")

    users: Mapped[list["User"]] = relationship(
        secondary=user_roles, back_populates="role"
    )

    def __repr__(self):
        return f"Role {self.name}"


class Space(db.Model, SerializerMixin):
    __tablename__ = "spaces"
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(unique=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    owner: Mapped["User"] = relationship(back_populates="spaces")
    bookings: Mapped[list["Booking"]] = relationship(back_populates="space")

    @property
    def availability(self):
        now = datetime.utcnow()

        # Check if there's an active booking
        for booking in self.bookings:
            if booking.status == BookingStatus.ACTIVE:
                return False  # Space is not available if a booking is active

            # If booking has a pending payment and was made within the last hour
            if booking.status == BookingStatus.UPCOMING:
                payment_pending = (
                    booking.payment and booking.payment.status == PaymentStatus.PENDING
                )
                time_since_booking = now - booking.created_at

                if payment_pending and time_since_booking <= timedelta(hours=1):
                    return False  # Space is not available if payment is pending and booking was made within 1 hour

        # If no active booking and no pending payments for recent bookings, space is available
        return True

    @property
    def owner_name(self):
        return self.owner.username

    serialize_only = ("availability", "owner_name", "id", "name")


class Booking(db.Model, SerializerMixin):
    __tablename__ = "bookings"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    name: Mapped[str] = mapped_column(unique=True)
    duration_hours: Mapped[int]

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    space_id: Mapped[int] = mapped_column(ForeignKey("spaces.id"))

    @property
    def status(self):
        now = datetime.utcnow()
        start = self.created_at
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


class Agreement(db.Model, SerializerMixin):
    __tablename__ = "agreements"
    id: Mapped[int] = mapped_column(primary_key=True)
    content: Mapped[str] = mapped_column(Text)
    signature: Mapped[str]

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))

    client: Mapped["User"] = relationship(back_populates="agreements")


class Payment(db.Model, SerializerMixin):
    __tablename__ = "payments"
    id: Mapped[int] = mapped_column(primary_key=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    status: Mapped[PaymentStatus] = mapped_column(default=PaymentStatus.PENDING)

    client_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    booking_id: Mapped[int] = mapped_column(ForeignKey("bookings.id"))

    client: Mapped["User"] = relationship(back_populates="payments")
    booking: Mapped["Booking"] = relationship(back_populates="payment")
