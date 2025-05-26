from flask import Blueprint, jsonify

from app.extentions import db
from sqlalchemy import select
from app.models import User

admin_bp = Blueprint("admin", __name__, url_prefix="/admin")


@admin_bp.get("/users")
def all_users():
    stmt = select(User)
    users = db.session.scalars(stmt).all()
    return jsonify([user.to_dict() for user in users])
