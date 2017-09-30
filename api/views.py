from flask import abort, jsonify, g, request

from api import app, engine, models

version = 1.0
api_endpoint = '/tableflip/api/v{}/'.format(version)

def user_view(user):
  return {
    "id": user.id,
    "username": user.username,
  }

def lobby_view(lobby):
  return {
    "id": lobby.id,
    "type": lobby.gametype.code,
    "min_players": lobby.gametype.max_players,
    "max_players": lobby.gametype.max_players,
    "players": [lobbygame.user.id for lobbygame in lobby.users]
  }

def game_view(game, include_view=False, player_id=-1):
  obj = {
    "id": game.id,
    "type": game.gametype.code,
    "finished": game.finished,
    "players": [usergame.user.id for usergame in game.users],
    "winners": [usergame.user.id for usergame in game.users if usergame.winner]
  }
  if include_view:
    obj["view"] = engine.player_view(game.gametype.code, game.state, player_id)
  return obj

def usergame_view(usergame):
  obj = game_view(usergame.game)
  obj["current_turn"] = usergame.current_turn
  return obj

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

@app.route(api_endpoint + 'users/<int:user_id>/games', methods=['GET'])
def get_user_games(user_id):
  try:
    user = models.User.query.get(user_id)
    usergames = user.games
    return jsonify([usergame_view(usergame) for usergame in usergames])
  except:
    abort(404)

@app.route(api_endpoint + 'lobbies', methods=['GET'])
def get_lobbies():
  lobbies = models.Lobby.query.all()
  return jsonify([lobby_view(lobby) for lobby in lobbies])

@app.route(api_endpoint + 'lobbies/<int:lobby_id>', methods=['GET'])
def get_lobby(lobby_id):
  try:
    lobby = models.Lobby.query.get(lobby_id)
    return jsonify(lobby_view(lobby))
  except:
    abort(404)

@app.route(api_endpoint + 'games', methods=['GET'])
def get_games():
  games = models.Game.query.all()
  return jsonify([game_view(game) for game in games])

@app.route(api_endpoint + 'games/<int:game_id>', methods=['GET'])
def get_game(game_id):
  user_id = request.args.get('user_id', 1) # mock user id, TODO fix when login done
  try:
    game = models.Game.query.get(game_id)
    usergame = models.UserGame.query.filter_by(game_id=game.id,
                                               user_id=user_id).first()
    player_id = usergame.player_id if usergame else -1
    return jsonify(game_view(game, include_view=True, player_id=player_id))
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
