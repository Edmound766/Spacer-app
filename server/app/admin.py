from flask import Blueprint, jsonify, request
from marshmallow import ValidationError
from sqlalchemy import select
from app.extentions import db

from app.models import Payment, User, Booking
from app.schemas import BookingSchema, PaymentSchema, UserSchema

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")
user_schema = UserSchema()
users_schema = UserSchema(many=True)
booking_schema = BookingSchema()
bookings_schema = BookingSchema(many=True)
payments_schema = PaymentSchema(many=True)


# TODO: User-admin routes
@admin_bp.get("/users")
def all_users():
    stmt = select(User)
    users = db.session.scalars(stmt).all()
    return users_schema.jsonify(users)


@admin_bp.post("/add-user")
def add_user():
    data = request.get_json()

    if not data:
        return jsonify("Invalid user details")
    try:
        user = user_schema.load(data, session=db.session)  # pyright: ignore
    except ValidationError as e:
        return jsonify(e.messages), 422

    db.session.add(user)
    db.session.commit()

    return jsonify(msg="Account created successfuly."), 201


@admin_bp.put("/users/<int:user_id>/update")
def update_user(user_id: int):
    user = User.query.get(user_id)
    if not user:
        return jsonify(message="User not found")
    data = request.get_json()
    if not data:
        return jsonify(message="No input provided")
    try:
        user = user_schema.load(data, instance=user, partial=True, session=db.session())

    except ValidationError as e:
        return jsonify(e.messages)
    db.session.add(user)
    db.session.commit()
    return user_schema.jsonify(user)


# TODO: Booking-admin routes
@admin_bp.get("/bookings")
def all_booking():
    stmt = select(Booking)
    bookings = db.session.scalars(stmt).all()

    return bookings_schema.jsonify(bookings)


@admin_bp.put("/bookings/<int:booking_id>")
def update_booking(booking_id: int):
    data = request.get_json()
    if not data:
        return jsonify("Invalid data"), 422
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.session.scalars(stmt).first()

    if not booking:
        return jsonify("Invalid id the product does not exits "), 404

    return jsonify("Booking was updated successfully.")


@admin_bp.delete("/bookings/<booking_id>/delete")
def delete_booking(booking_id: int):
    data = request.get_json()

    if not data:
        return jsonify("Invalid data"), 422
    stmt = select(Booking).where(Booking.id == booking_id)
    booking = db.session.scalars(stmt).first()

    if not booking:
        return jsonify("Invalid id the product does not exits "), 404
    db.session.delete(booking)
    db.session.commit()
    return jsonify(success="Was deleted successfully"), 204


@admin_bp.put("/put")
def update_booing():
    data = request.get_json()
    print(data)
    return jsonify(msg="Booking was updated successfuly")


# payments
# TODO: Payments-admin routes
@admin_bp.get("/payments")
def all_payments():
    payments = Payment.query.all()
    return payments_schema.jsonify(payments)
