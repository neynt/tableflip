from flask import abort, jsonify, g, request

from api import app, engine, models

version = 1.0
api_endpoint = '/tableflip/api/v{}/'.format(version)

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

@app.route(api_endpoint + 'users', methods=['GET'])
def get_users():
  users = models.User.query.all()
  return jsonify(list(map(user_view, users)))

@app.route(api_endpoint + 'users/<int:user_id>', methods=['GET'])
def get_user(user_id):
  try:
    user = models.User.query.get(user_id)
    return jsonify(user_view(user))
  except:
    abort(404)

@app.route(api_endpoint + 'games', methods=['GET'])
def get_games():
  games = models.Game.query.all()
  return jsonify(list(map(game_view, games)))

@app.route(api_endpoint + 'games/<int:game_id>', methods=['GET'])
def get_game(game_id):
  try:
    game = models.Game.query.get(game_id)
    return jsonify(game_view(game))
  except:
    abort(404)

@app.route(api_endpoint + 'games/<int:game_id>/action', methods=['POST'])
def perform_action(game_id):
  try:
    game = models.Game.query.get(game_id)
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
