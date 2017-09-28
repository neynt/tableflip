import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask.ext.admin import Admin
from flask.ext.sqlalchemy import SQLAlchemy
from flask_security import SQLAlchemyUserDatastore, Security

app_name = 'tableflip'
app = Flask(app_name)

from api import views

# config value for database
#app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# config value for Flask-Security by using PBKDF2 with salt
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'

CORS(app)

db = SQLAlchemy(app)
roles_users = db.Table(
    'roles_users',
    db.Column('user_id', db.Integer(), db.ForeignKey('user.id')),
    db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))
)

from api import models

user_datastore = SQLAlchemyUserDatastore(db, models.User, models.Role)
security = Security(app, user_datastore)
# Initialize Flask-Admin
admin = Admin(app)

# Add Flask-Admin views for Users and Roles
admin.add_view(models.UserAdmin(models.User, db.session))
admin.add_view(models.RoleAdmin(models.Role, db.session))

