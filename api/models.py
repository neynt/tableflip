import random

from api import db, engine

class UserLobby(db.Model):
  __tablename__ = 'user_lobby'
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
  lobby_id = db.Column(db.Integer, db.ForeignKey('lobby.id'), primary_key=True)
  user = db.relationship('User', back_populates='lobbies')
  lobby = db.relationship('Lobby', back_populates='users')
  def __repr__(self):
    return '<UserLobby user=%r lobby=%r>' % (self.user, self.lobby)

class UserGame(db.Model):
  user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
  game_id = db.Column(db.Integer, db.ForeignKey('game.id'), primary_key=True)
  player_id = db.Column(db.Integer)
  user = db.relationship('User', back_populates='games')
  game = db.relationship('Game', back_populates='users')
  current_turn = db.Column(db.Boolean, default=False)
  winner = db.Column(db.Boolean, default=False)

class User(db.Model):
  __tablename__ = 'users' # user is reserved in PostgreSQL
  id = db.Column(db.Integer, primary_key=True)
  username = db.Column(db.String(255), unique=True)
  password = db.Column(db.String(255))
  lobbies = db.relationship('UserLobby', back_populates='user')
  games = db.relationship('UserGame', back_populates='user')

  def __repr__(self):
    return '<User username=%r>' % (self.username)

class Lobby(db.Model):
  __tablename__ = 'lobby'
  id = db.Column(db.Integer, primary_key=True)
  users = db.relationship('UserLobby', back_populates='lobby')
  gametype = db.Column(db.String(16))
  game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
  game = db.relationship('Game')

  def __repr__(self):
    return '<Lobby id=%r gametype_id=%r game_id=%r>' % (
        self.id, self.gametype_id, self.game_id)

class Game(db.Model):
  __tablename__ = 'game'
  id = db.Column(db.Integer, primary_key=True)
  state = db.Column(db.JSON())
  users = db.relationship('UserGame', back_populates='game')
  finished = db.Column(db.Boolean, default=False)
  gametype = db.Column(db.String(16))

  @classmethod
  def create_from_lobby(self, lobby):
    userlobbies = lobby.users

    # Get inital state from game engine.
    response = engine.initial_state(lobby.gametype, len(userlobbies))

    game = Game(state=response['game_state'], finished=response['finished'], gametype=lobby.gametype)
    db.session.add(game)

    player_ids = list(range(len(userlobbies)))
    random.shuffle(player_ids)
    for i, userlobby in enumerate(userlobbies):
      usergame = UserGame(user=userlobby.user,
                          game=game,
                          player_id=player_ids[i],
                          current_turn=player_ids[i] in response['current_players'])
      db.session.add(usergame)

    lobby.game = game
    db.session.add(lobby)

    return game

  def __repr__(self):
    return '<Game id=%r gametype=%r finished=%r>' % (
        self.id, self.gametype, self.finished)

def init_db():
  db.drop_all()
  db.create_all()

def ensure_db_exists():
  db.create_all()

def sample_data():
  user = User(username='foo', password='bar')
  db.session.add(user)
  user2 = User(username='baz', password='bar')
  db.session.add(user2)

  game = Game(gametype='connect4', state={
    'board': [[-1 for i in range(7)] for j in range(6)],
    'current_player': 0,
    'winner': -1})
  db.session.add(game)

  usergame = UserGame(player_id=0, user=user, game=game, current_turn=True)
  usergame = UserGame(player_id=1, user=user2, game=game, current_turn=False)
  # Alternate method #1 of adding relation:
  # usergame = UserGame(player_id=0, user=user)
  # game.users.append(usergame)
  # Alternate method #2 of adding relation:
  # usergame = UserGame(player_id=0, game=game)
  # user.games.append(usergame)
  db.session.add(usergame)

  lobby = Lobby(gametype='connect4')
  db.session.add(lobby)

  userlobby = UserLobby(user=user, lobby=lobby)
  db.session.add(userlobby)

  db.session.commit()
