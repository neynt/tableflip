from flask_admin.contrib import sqla
from wtforms.fields import PasswordField

from api import db, roles_users

class Role(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

    # required fields for Flask-Admin
    def __str__(self):
        return self.name

    def hash(self):
        return hash(self.name)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    #active = db.Column(db.Boolean())
    #confirmed_at = db.Column(db.DateTime())
    #roles = db.relationship('Role',secondary=roles_users, backref=db.backref('users', lazy='dynamic'))

    def __repr__(self):
        return '<User %r>' % (self.email)

class Lobby(db.Model):
    id = db.Column(db.Integer, primary_key=True)

class Game(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    state = db.Column(db.String(255))

class UserAdmin(sqla.ModelView):
    # exclude password from list of users
    column_exclude_list = list = ('password',)

    form_excluded_columns = ('password',)
    # Automatically display human-readable names for the current and available
    # Roles when creating or editing a User
    column_auto_select_related = True

    # Prevent administration of Users unless the currently logged-in user has the "admin" role
    def is_accessible(self):
        return current_user.has_role('admin')

    # Don't display password that is as same as model's password field because
    # we want to store encrypted password not what users entered
    def scaffold_form(self):
        form_class = super(UserAdmin, self).scaffold_form()

        # Add a password field, naming it "password2" and labeling it "New Password".
        form_class.password2 = PasswordField('New Password')
        return form_class

    def on_model_change(self, form, model, is_created):
        # if password field isn't blank, encrypt it and save it, else old
        # password remains
        if len(model.password2):
            model.password = utils.encrypt_password(model.password2)

class RoleAdmin(sqla.ModelView):
    def is_accessible(self):
        return current_user.has_role('admin')
