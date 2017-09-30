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
    return '<User %r>' % (self.username)

class Lobby(db.Model):
  __tablename__ = 'lobby'
  id = db.Column(db.Integer, primary_key=True)
  users = db.relationship('UserLobby', back_populates='lobby')
  gametype_id = db.Column(db.Integer, db.ForeignKey('gametype.id'))
  gametype = db.relationship('GameType')
  game_id = db.Column(db.Integer, db.ForeignKey('game.id'), nullable=True)
  game = db.relationship('Game')

class Game(db.Model):
  __tablename__ = 'game'
  id = db.Column(db.Integer, primary_key=True)
  state = db.Column(db.JSON())
  users = db.relationship('UserGame', back_populates='game')
  finished = db.Column(db.Boolean, default=False)
  gametype_id = db.Column(db.Integer, db.ForeignKey('gametype.id'))
  gametype = db.relationship('GameType')

class GameType(db.Model):
  __tablename__ = 'gametype'
  id = db.Column(db.Integer, primary_key=True)
  code = db.Column(db.String(255), unique=True) # API identifier
  name = db.Column(db.String(255)) # Human-readable name
  min_players = db.Column(db.Integer)
  max_players = db.Column(db.Integer)

def init_db():
  db.drop_all()
  db.create_all()

def ensure_db_exists():
  db.create_all()

def sample_data():
  gametype = GameType(code='connect4', name='Connect 4',
      min_players=2, max_players=2)
  db.session.add(gametype)

  user = User(username='foo', password='bar')
  db.session.add(user)

  game = Game(gametype=gametype, state={
    'board': [[-1 for i in range(7)] for j in range(6)],
    'current_player': 0,
    'winner': -1})
  db.session.add(game)

  usergame = UserGame(player_id=0, user=user, game=game, current_turn=True)
  # Alternate method #1 of adding relation:
  # usergame = UserGame(player_id=0, user=user)
  # game.users.append(usergame)
  # Alternate method #2 of adding relation:
  # usergame = UserGame(player_id=0, game=game)
  # user.games.append(usergame)
  db.session.add(usergame)

  lobby = Lobby(gametype=gametype)
  db.session.add(lobby)

  userlobby = UserLobby(user=user, lobby=lobby)
  db.session.add(userlobby)

  db.session.commit()
