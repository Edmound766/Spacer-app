from flask import Blueprint, jsonify

from app.models import User

admin_bp = Blueprint("admin",__name__,url_prefix='/admin')

@admin_bp.get('/users')
def all_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

