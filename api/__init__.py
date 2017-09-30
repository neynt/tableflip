import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

app_name = 'tableflip'
app = Flask(app_name)

# NOTE: Expect to setup all these things before you can import views/models
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://localhost/{db}'.format(db=app_name)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = False

CORS(app)

db = SQLAlchemy(app)

from api import models, views
