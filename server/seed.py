from datetime import datetime, timedelta, timezone
from pprint import pprint
from faker.proxy import Faker
from sqlalchemy import select
from sqlalchemy.sql import roles

from app import create_app
from app.models import Role, db, User, Space, Booking, Payment, PaymentStatus

fake = Faker()

app = create_app()


# Seeder function
def seed_availability_test_data():
    # Create users
    admin_role = Role(name="admin")
    client_role = Role(name="client")

    db.session.add_all([admin_role, client_role])
    db.session.commit()

    user1 = User(
        username="john_doe", email="john@example.com", roles=[client_role, admin_role]
    )
    password = fake.password()
    print(password)
    user1.password = password

    user2 = User(username="jane_doe", email="jane@example.com", roles=[client_role])
    user2.password = fake.password()

    db.session.add_all([user1, user2])
    db.session.commit()

    # Create spaces
    space1 = Space(name="Conference Room 1", user_id=user1.id)
    space2 = Space(name="Event Hall", user_id=user2.id)
    space3 = Space(name=fake.name(), user_id=user1.id)
    db.session.add_all([space1, space2])
    db.session.commit()

    # Create bookings
    # Booking 1: Active booking (should make space unavailable)
    booking1 = Booking(
        created_at=datetime.now(timezone.utc)
        - timedelta(hours=1),  # created 1 hour ago
        duration_hours=2,
        name=fake.name(),
        user_id=user2.id,
        space_id=space1.id,
    )
    db.session.add(booking1)
    db.session.commit()

    # Mark the payment as PAID for booking1
    payment1 = Payment(
        client_id=user2.id, booking_id=booking1.id, status=PaymentStatus.PAID
    )
    db.session.add(payment1)
    db.session.commit()

    # Booking 2: Upcoming with pending payment (should make space unavailable within 1 hour)
    booking2 = Booking(
        created_at=datetime.now(timezone.utc)
        - timedelta(minutes=30),  # created 30 minutes ago
        duration_hours=1,
        name=fake.name(),
        user_id=user1.id,
        space_id=space1.id,
    )
    db.session.add(booking2)
    db.session.commit()

    # No payment for booking2 yet (pending payment)
    payment2 = Payment(
        client_id=user1.id, booking_id=booking2.id, status=PaymentStatus.PENDING
    )
    db.session.add(payment2)
    db.session.commit()

    # Booking 3: Completed booking (should make space unavailable)
    booking3 = Booking(
        created_at=datetime.now(timezone.utc)
        - timedelta(hours=3),  # created 3 hours ago
        duration_hours=2,
        name=fake.name(),
        user_id=user1.id,
        space_id=space2.id,
    )
    db.session.add(booking3)
    db.session.commit()

    # Mark the payment as PAID for booking3
    payment3 = Payment(
        client_id=user1.id, booking_id=booking3.id, status=PaymentStatus.PAID
    )
    db.session.add(payment3)
    db.session.commit()

    # Now check the availability of both spaces
    print(f"Availability of Space 1 (Conference Room 1): {space1.availability}")
    print(f"Availability of Space 2 (Event Hall): {space2.availability}")

    # Booking 1 (Active) and Booking 2 (Upcoming with pending payment) should make Space 1 unavailable
    # Booking 3 (Completed) should make Space 2 unavailable


with app.app_context():
    db.drop_all()
    db.create_all()
    # Run the seeder function to test availability
    seed_availability_test_data()
