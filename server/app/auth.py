from flask import Blueprint, jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    set_access_cookies,
    unset_access_cookies,
)

from marshmallow import ValidationError
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError

from app.extentions import db
from app.models import Role, User
from app.schemas import CredentialSchema, UserSchema

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

user_schema = UserSchema()


@auth_bp.route("/register", methods=["POST"])
def register_user():
    data = request.get_json()
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"message": "Missing username, email, or password"}), 400

    try:
        # 1. Check if the username or email already exists
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            return jsonify({"message": "Username or email already exists"}), 409

        # 2. Fetch the 'client' role
        # It's important that this role exists in your database from seeding/migrations
        client_role = Role.query.filter_by(name="client").first()

        if not client_role:
            # This indicates a setup problem; the 'client' role should always exist.
            print(
                "WARNING: 'client' role not found in the database. Please run your seeder."
            )
            # You might choose to create it here, or raise an error, depending on your app's robustness
            # For now, we'll proceed, but it's a good place to log or error.
            # If you want to create it if it doesn't exist:
            # client_role = Role(name='client')
            # db.session.add(client_role)
            # db.session.commit() # Commit immediately to make it available for the new user

        # 3. Create the new user
        new_user = User(username=username, email=email)  # type: ignore
        new_user.password = password  # This uses your password setter with bcrypt

        # 4. Assign the 'client' role to the new user
        if client_role:
            new_user.roles.append(client_role)
        else:
            # Handle case where client_role wasn't found - maybe assign no roles or a default 'user' role
            pass  # Or raise an error, or log it

        db.session.add(new_user)
        db.session.commit()

        return jsonify(
            {"message": "User registered successfully", "user_id": new_user.id}
        ), 201

    except IntegrityError:
        db.session.rollback()  # Rollback the session in case of database error
        return jsonify(
            {"message": "A user with this username or email already exists."}
        ), 409
    except Exception as e:
        db.session.rollback()
        return jsonify(
            {"message": "An error occurred during registration", "error": str(e)}
        ), 500


login_schema = CredentialSchema()


@auth_bp.post("/login")
def login():
    json_data = request.get_json()

    if not json_data:
        return jsonify(message="There must be a request json"), 400

    try:
        credentials = login_schema.load(json_data)
    except ValidationError as e:
        return jsonify(message=e.messages_dict)
    print(credentials)
    email = credentials["email"]  # type:ignore
    password = credentials["password"]  # type:ignore

    stmt = select(User).where(User.email == email)
    user = db.session.scalars(stmt).first()
    if user and user.check_password(password):
        res = user_schema.jsonify(user)

        access_token = create_access_token(identity=str(user.id))
        set_access_cookies(res, access_token)
        return res, 200
    else:
        return jsonify(message="Invalid credentials"), 401


@auth_bp.post("/social-login")
def social_login():
    data = request.get_json()
    return jsonify(msg=f"User has logged in successfully via {data['social']}")


@auth_bp.post("/logout")
def logout():
    res = jsonify(msg="User has logged in successfully")
    unset_access_cookies(res)
    return res, 200


@auth_bp.get("/profile")
@jwt_required()
def profile():
    user_id = get_jwt_identity()

    user = User.query.get(int(user_id))

    return user_schema.jsonify(user)
