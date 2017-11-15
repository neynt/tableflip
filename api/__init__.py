import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt

app_name = 'tableflip'
app = Flask(app_name)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

app.secret_key = os.environ.get('SECRET_KEY')

CORS(app, supports_credentials=True)
db = SQLAlchemy(app)

bcrypt = Bcrypt(app)

from api import models, views
