from datetime import timedelta


class Config:
    DEBUG = True
    SECRET_KEY = "super-secret-key"
    SQLALCHEMY_DATABASE_URI = "sqlite:///space.sqlite"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    FLASK_SECRET_KEY = "SECRET_KEY"
    JWT_COOKIE_SECURE = False
    JWT_TOKEN_LOCATION = ["cookies"]
    JWT_SECRET_KEY = "spacer-app"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
