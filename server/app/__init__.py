from datetime import datetime, timedelta
from time import timezone

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import get_jwt, create_access_token, get_jwt_identity, set_access_cookies

from app.admin import admin_bp
from app.auth import auth_bp
from app.client import client_bp
from app.extentions import *


def create_app():
    app=Flask(__name__)
    #configuration of app
    app.config.from_object("config.Config")

    # This initializes the extensions
    db.init_app(app)
    migrate.init_app(app,db)
    jwt.init_app(app)
    bcrypt.init_app(app)

    CORS(app,supports_credentials=True)

    with app.app_context():
        from .models import User,Space,Role,Payment,Booking,Agreement

    @app.after_request
    def refresh_token(response):
        try:
            exp_timestamp = get_jwt()["exp"]
            now = datetime.now()
            target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
            if target_timestamp > exp_timestamp:
                access_token = create_access_token(identity=get_jwt_identity())
                set_access_cookies(response, access_token)
            return response
        except (RuntimeError, KeyError):
            # Case where there is not a valid JWT. Just return the original response
            return response

    #register blueprints
    app.register_blueprint(auth_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(client_bp)


    @app.get("/")
    def index():
        return "hello world"

    return app

