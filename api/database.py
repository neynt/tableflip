import psycopg2
from collections import namedtuple

User = namedtuple('User', ['id', 'username', 'password'])
Lobby = namedtuple('Lobby', ['id'])
Game = namedtuple('Game', ['id', 'state'])

def user_view(user):
  return {
    "id": user.id,
    "username": user.username,
  }

def game_view(game):
  return {
    "id": game.id,
    "state": game.state,
  }

def get_users(conn):
  c = conn.cursor()
  c.execute("SELECT * FROM users;")
  return list(map(User._make, c.fetchall()))

def get_user(conn, user_id):
  c = conn.cursor()
  c.execute("SELECT * FROM users WHERE id=%s;", (user_id,))
  return User(*(c.fetchone()))

def get_game(conn, game_id):
  c = conn.cursor()
  c.execute("SELECT * FROM games WHERE id=%s;", (game_id,))
  return Game(*(c.fetchone()))

def connect_db():
  """Connects to the database"""
  return psycopg2.connect(dbname="tableflip")