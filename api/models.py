from api import db


class UserLobby(db.Model):
  __tablename__ = 'user_lobby'
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
  lobby_id = db.Column(db.Integer, db.ForeignKey('lobby.id'), primary_key=True)
  user = db.relationship('User', back_populates='lobbies')
  lobby = db.relationship('Lobby', back_populates='users')

class UserGame(db.Model):
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
  game_id = db.Column(db.Integer, db.ForeignKey('game.id'), primary_key=True)
  player_id = db.Column(db.Integer)
  user = db.relationship('User', back_populates='games')
  game = db.relationship('Game', back_populates='users')

class User(db.Model):
  __tablename__ = 'users' # user is reserved in PostgreSQL
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(255), unique=True)
  password = db.Column(db.String(255))
  lobbies = db.relationship('UserLobby', back_populates='user')
  games = db.relationship('UserGame', back_populates='user')

  def __repr__(self):
    return '<User %r>' % (self.username)

class Lobby(db.Model):
  __tablename__ = 'lobby'
  id = db.Column(db.Integer, primary_key=True)
  users = db.relationship('UserLobby', back_populates='lobby')

class Game(db.Model):
  __tablename__ = 'game'
  id = db.Column(db.Integer, primary_key=True)
  state = db.Column(db.JSON())
  users = db.relationship('UserGame', back_populates='game')

def init_db():
  db.drop_all()
  db.create_all()

def ensure_db_exists():
  db.create_all()
