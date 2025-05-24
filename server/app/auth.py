from datetime import timedelta
from turtle import st
from sqlalchemy import select
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required,set_access_cookies, unset_access_cookies

from app.extentions import *

from app.models import Role, User

auth_bp=Blueprint("auth",__name__,url_prefix="/auth")




@auth_bp.post("/register")
def register():
    try:
        stmt = select(Role).where(Role.name=="client")
        role = db.session.scalars(stmt).first()
        
        data=request.get_json()
        username = data['username']
        email=data['email']
        password = data['passord']

        if not username or not email or not password:
            return  jsonify({ "message":"Username, Email and Password are required"}),400

        user = User(username=username,email=email,role=role) # type: ignore
        user.password=password

        return jsonify(user.to_dict()),201
    except Exception as e:
        return jsonify(error=f"Error {e}")
    


@auth_bp.post("/login")
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if not email and not password :
        return  jsonify(error="Password and email are required."),400
    
    stmt = select(User).where(User.email==email)
    user = db.session.scalars(stmt).first()
    if not user:
        return jsonify(error=f'Invalid credetials '),401
    
    if  user.check_password(password)==False:
        return jsonify(error="Invalid Password"),401

    res = jsonify(user.to_dict())
    access_token=create_access_token(identity=str(user.id))
    set_access_cookies(res,encoded_access_token=access_token,max_age=timedelta(hours=1))

    return res,200


@auth_bp.post("/social-login")
def social_login():
    data = request.get_json()
    return jsonify(msg=f"User has logged in successfully via {data['social']}")

@auth_bp.post("/logout")
@jwt_required()
def logout():
    res =jsonify(msg="Uhas logged in successfully")
    unset_access_cookies(res)
    return res,200

@auth_bp.get("/profile")
@jwt_required()
def profile():
    userId = get_jwt_identity()
    stmt = select(User).where(User.id == int(userId))
    user = db.session.scalars(stmt).first()
    if not user:
        return jsonify(error=f"User with id {userId} not found."),404

    return jsonify(user.to_dict()),200
