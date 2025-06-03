from flask import Blueprint, jsonify
from sqlalchemy import select

from app.extentions import db
from app.models import Space
from app.schemas import SpaceSchema

client_bp = Blueprint("client", __name__)

spaces_schema = SpaceSchema(many=True)


@client_bp.get("/spaces")
def all_spaces():
    spaces = Space.query.all()
    return spaces_schema.jsonify(spaces)


@client_bp.get("/spaces/<int:id>")
def space_details(id):
    print(id)
    stmt = select(Space).where(Space.id == id)
    space = db.session.scalars(stmt).first()
    if not space:
        return jsonify(error="Space not found invalid id"), 404
    return jsonify(space.to_dict()), 200
