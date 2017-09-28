from api import app, database, engine
from flask import abort, jsonify, g, request

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

@app.route(api_endpoint + 'games', methods=['GET'])
def get_games():
  return jsonify({'Yes, my man': 69})

@app.route(api_endpoint + 'games/<int:game_id>', methods=['GET'])
def get_game(game_id):
  try:
    game = database.get_game(get_db(), game_id)
    return jsonify(database.game_view(game))
  except:
    abort(404)

@app.route(api_endpoint + 'games/<int:game_id>/action', methods=['POST'])
def perform_action(game_id):
  try:
    game = database.get_game(get_db(), game_id)
  except:
    abort(404)

  try:
    data = request.get_json()
    result = engine.perform_action('connect4', game.state, data['player'], data['action'])
    # don't actually update state, just return result
    return jsonify(result)
  except Exception as e:
    response = jsonify({'error': e.args[0]})
    response.status_code = 500
    return response

@app.route('/')
def hello_world():
  return 'Hello, World!'
