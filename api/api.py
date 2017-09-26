from api import app, database
from flask import abort, jsonify, g

api_endpoint = '/tableflip/api/v1.0/'

def get_db():
  if not hasattr(g, 'postgres_db'):
    g.postgres_db = database.connect_db()
  return g.postgres_db

@app.route(api_endpoint + 'users', methods=['GET'])
def get_users():
  users = database.get_users(get_db())
  return jsonify(list(map(database.user_view, users)))

@app.route(api_endpoint + 'users/<int:user_id>', methods=['GET'])
def get_user(user_id):
  try:
    user = database.get_user(get_db(), user_id)
    return jsonify(database.user_view(user))
  except:
    abort(404)

@app.route('/')
def hello_world():
  return 'Hello, World!'
