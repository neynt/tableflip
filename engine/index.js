var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var gameRouter = express.Router();

// Loads game rules into req.rules. Calls to require are cached and
// rules modules are self-contained, so this should be pretty fast.
gameRouter.use('/:game', function getGameRules(req, res, next) {
  // Strip all non-alphanumeric characters for safety
  var game = req.params['game'].replace(/\W/g, '');
  try {
    req.rules = require('../games/' + game + '/rules');
    next();
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game').get(function (req, res) {
  if (req.rules !== undefined) {
    res.send('ok');
  } else {
    res.status(500).send('game not found');
  }
});

gameRouter.route('/:game/initial_state').post(function(req, res) {
  var players = req.body['players'];
  try {
    res.send(req.rules.initial_state(players));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/player_view').post(function(req, res) {
  var game_state = req.body['game_state'];
  var player = req.body['player'];
  try {
    res.send(req.rules.player_view(game_state, player));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/current_players').post(function(req, res) {
  var game_state = req.body['game_state'];
  try {
    res.send(req.rules.current_players(game_state));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/has_legal_action').post(function(req, res) {
  var game_view = req.body['game_view'];
  try {
    res.send(req.rules.has_legal_action(game_view));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/is_action_legal').post(function(req, res) {
  var game_view = req.body['game_view'];
  var action = req.body['action'];
  try {
    res.send(req.rules.is_action_legal(game_view, action));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/perform_action').post(function(req, res) {
  var game_state = req.body['game_state'];
  var player = req.body['player'];
  var action = req.body['action'];
  try {
    res.send(req.rules.perform_action(game_state, player, action));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/is_game_finished').post(function(req, res) {
  var game_state = req.body['game_state'];
  try {
    res.send(req.rules.is_game_finished(game_state));
  } catch (err) {
    res.status(500).send(err);
  }
});

gameRouter.route('/:game/winners').post(function(req, res) {
  var game_state = req.body['game_state'];
  try {
    res.send(req.rules.winners(game_state));
  } catch (err) {
    res.status(500).send(err);
  }
});

app.use(bodyParser.json());
app.use('/', gameRouter);

app.get('/', function(req, res) {
  res.send('game engine ok');
});

app.listen(3000, function () {
  console.log('Listening on port 3000');
});
