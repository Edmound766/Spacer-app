from marshmallow import fields, Schema, post_load, validate, ValidationError
from app.extentions import ma, db
from app.models import Payment, Space, User, Role, Booking


class RoleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Role
        load_instance = True
        include_relationships = True


class UserSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = User
        include_relationships = True
        load_instance = True
        sqla_session = db.session
        exclude = ("hashed_password",)

    # for deserialization
    password = fields.String(required=True)
    email = fields.Email(required=True)
    roles = fields.Pluck("RoleSchema", "name", many=True)
    spaces = fields.Pluck("SpaceSchema", "name", many=True)
    bookings = fields.Nested(lambda: BookingSchema(only=("id", "name")), many=True)


class SpaceSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Space
        load_instance = True
        include_relationships = True

    owner = fields.Pluck("UserSchema", "username", attribute="owner")
    bookings = fields.Nested(lambda: BookingSchema(only=("id", "name")), many=True)
    availability = fields.Boolean(dump_only=True)


class BookingSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Booking
        load_instance = True
        include_relationships = True


class PaymentSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Payment
        load_instance = True
        inlude_fk = True
        include_relationships = True

    client = fields.Pluck("UserSchema", "username")
    booking = fields.Pluck("BookingSchema", "name")


class CredentialSchema(Schema):
    """
    A stricter LoginSchema that uses a custom `validate` method
    to ensure either username or email is provided.
    """

    username = fields.String(
        required=False,
        validate=validate.Length(min=3, max=80),
        metadata={"description": "The user's unique username."},
    )
    email = fields.Email(
        required=False, metadata={"description": "The user's unique email address."}
    )
    password = fields.String(
        required=True,
        validate=validate.Length(min=6),
        load_only=True,
        metadata={"description": "The user's password."},
    )

    @post_load
    def require_username_or_email(self, data, **kwargs):
        if not data.get("username") and not data.get("email"):
            raise ValidationError(
                "Either 'username' or 'email' must be provided.",
            )
        return data
