import os
import requests

ENGINE_PORT = os.environ.get('ENGINE_PORT', 3000)
ENGINE_URL = 'http://localhost:{}'.format(ENGINE_PORT)

def game_types():
  r = requests.get('{}/types'.format(ENGINE_URL))
  if r.status_code == requests.codes.ok:
    return r.json()
  else:
    raise Exception(r.json()['error'])

def engine_query(game, endpoint, params):
  r = requests.post('{}/{}/{}'.format(ENGINE_URL, game, endpoint),
                    json=params)
  if r.status_code == requests.codes.ok:
    return r.json()
  else:
    raise Exception(r.json()['error'])

def initial_state(game, players):
  return engine_query(game, 'initial_state',
      {'players': players})

def player_view(game, game_state, player):
  return engine_query(game, 'player_view',
      {'game_state': game_state, 'player': player})

def current_players(game, game_state):
  return engine_query(game, 'current_players',
      {'game_state': game_state})

def has_legal_action(game, game_view):
  return engine_query(game, 'has_legal_action',
      {'game_view': game_view})

def is_action_legal(game, game_view, action):
  return engine_query(game, 'is_action_legal',
      {'game_view': game_view, 'action': action})

def perform_action(game, game_state, player, action):
  return engine_query(game, 'perform_action',
      {'game_state': game_state, 'player': player, 'action': action})

def is_game_finished(game, game_state):
  return engine_query(game, 'is_game_finished',
      {'game_state': game_state})

def winners(game, game_state):
  return engine_query(game, 'winners',
      {'game_state': game_state})

def info(game, game_state):
  return engine_query(game, 'info',
      {'game_state': game_state})
