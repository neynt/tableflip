import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_admin import Admin
from flask.ext.sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore, Security

app_name = 'tableflip'
app = Flask(app_name)

# NOTE: Expect to setup all these things before you can import views/models
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/{db}'.format(db=app_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# config value for Flask-Security by using PBKDF2 with salt
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'

CORS(app)

db = SQLAlchemy(app)

from api import models, views
