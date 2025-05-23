from flask import Blueprint, jsonify

from app.models import Space

client_bp=Blueprint("client",__name__)

@client_bp.get("/spaces")
def all_spaces():
    spaces = Space.query.all()
    return jsonify([space.to_dict() for space in spaces])