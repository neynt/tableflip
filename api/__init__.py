import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app_name = 'tableflip'
app = Flask(app_name)

app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

app.secret_key = os.environ.get('SECRET_KEY')

CORS(app)
db = SQLAlchemy(app)

from api import models, views
