import os
basedir = os.path.abspath(os.path.dirname(__file__))

class Config():
    DEBUG = False
    TESTING = False
    CSRF_ENABLED = True
    SQLALCHEMY_DATABASE_URI = os.environ['DATABASE_URL']

class ProductionConfig(Config):
    DEBUG = False

class TestingConfig(Config):
    TESTING = True
