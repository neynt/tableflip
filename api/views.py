from flask import abort, jsonify, g, request, session

from api import app, engine, models, db

version = 1.0
api_endpoint = '/tableflip/api/v{}/'.format(version)

@app.before_request
def before_request():
  g.user = models.User.query.filter_by(id=session.get('user_id')).first()

def user_view(user):
  return {
    "id": user.id,
    "username": user.username,
  }

def lobby_view(lobby):
  obj = {
    "id": lobby.id,
    "type": lobby.gametype.code,
    "min_players": lobby.gametype.max_players,
    "max_players": lobby.gametype.max_players,
    "players": [lobbygame.user_id for lobbygame in lobby.users]
  }
  if lobby.game_id is not None:
    obj["game_id"] = lobby.game_id
  return obj

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

@app.route(api_endpoint + 'reauthenticate', methods=['POST'])
def reauthenticate():
  """Refreshes an authentication session using a stored cookie."""
  if g.user:
    return jsonify({'success': True, 'user': user_view(g.user)})
  else:
    return jsonify({'success': False})

@app.route(api_endpoint + 'register', methods=['POST'])
def register():
  try:
    data = request.get_json()
    username = data['username']
    password = 'bar' # TODO: hash and store actual password
    new_user = models.User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()

    session['user_id'] = new_user.id
    session.permanent = True
    return jsonify({'success': True, 'user': user_view(new_user)})

  except:
    abort(403)

@app.route(api_endpoint + 'login', methods=['POST'])
def login():
  data = request.get_json()
  username = data['username']
  user = models.User.query.filter_by(username=username).first()

  if user: # TODO: verify password
    session['user_id'] = user.id
    session.permanent = True
    return jsonify({'success': True, 'user': user_view(user)})
  else:
    abort(403)

@app.route(api_endpoint + 'logout', methods=['GET'])
def logout():
  session.pop('user_id', None)
  return jsonify({'success': True})

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
  lobbies = models.Lobby.query.filter_by(game_id=None).all()
  return jsonify([lobby_view(lobby) for lobby in lobbies])

@app.route(api_endpoint + 'lobbies/<int:lobby_id>', methods=['GET'])
def get_lobby(lobby_id):
  try:
    lobby = models.Lobby.query.get(lobby_id)
    return jsonify(lobby_view(lobby))
  except:
    abort(404)

@app.route(api_endpoint + 'lobbies/<int:lobby_id>/start', methods=['POST'])
def start_lobby(lobby_id):
  user_id = g.user.id if g.user else -1
  try:
    lobby = models.Lobby.query.get(lobby_id)

    # Game must not have been started.
    if lobby.game_id is not None:
      raise Exception('game already started')

    # User must be in the lobby.
    userlobby = models.UserLobby.query.filter_by(user_id=user_id,
                                                 lobby_id=lobby.id).first()
    if userlobby is None:
      raise Exception('user not in lobby')

    game = models.Game.create_from_lobby(lobby)
    db.session.commit()
    return jsonify(lobby_view(lobby))

  except Exception as e:
    print('Exception in start_lobby: {}'.format(e))
    abort(403)

@app.route(api_endpoint + 'games', methods=['GET'])
def get_games():
  games = models.Game.query.all()
  return jsonify([game_view(game) for game in games])

@app.route(api_endpoint + 'games/<int:game_id>', methods=['GET'])
def get_game(game_id):
  user_id = g.user.id if g.user else -1
  try:
    game = models.Game.query.get(game_id)
    usergame = models.UserGame.query.filter_by(game_id=game.id,
                                               user_id=user_id).first()
    player_id = usergame.player_id if usergame else -1
    return jsonify(game_view(game, include_view=True, player_id=player_id))

  except Exception as e:
    print("Exception in get_game: {}".format(e))
    abort(404)

@app.route(api_endpoint + 'games/<int:game_id>/action', methods=['POST'])
def perform_action(game_id):
  user_id = g.user.id if g.user else -1
  try:
    game = models.Game.query.get(game_id)
  except:
    abort(404)

  try:
    usergame = models.UserGame.query.filter_by(game_id=game.id,
                                               user_id=user_id).first()
    player_id = usergame.player_id if usergame else -1

    data = request.get_json()
    result = engine.perform_action('connect4', game.state, player_id, data['action'])

    game.state = result['game_state']
    game.finished = result['finished']
    db.session.add(game)
    for usergame in game.users:
      usergame.winner = usergame.player_id in result['winners']
      usergame.current_turn = usergame.player_id in result['current_players']
      db.session.add(usergame)
    db.session.commit()

    return jsonify(game_view(game, include_view=True, player_id=player_id))

  except Exception as e:
    print("Exception in perform_action: {}".format(e))
    response = jsonify({'error': e.args[0]})
    response.status_code = 500
    return response

@app.route('/')
def hello_world():
  return 'Hello, World!'
