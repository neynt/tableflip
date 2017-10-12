/* Rules for Love Letter.
 *
 * Representation of game state:
 * {
 *   deck: [card],
 *   hands: [[card]],
 *   discards: [[card]],
 *   num_wins: [int],      // Number of wins for each player
 *   num_players: int,
 *   current_player: int,
 * }
 *
 * Representation of game view:
 * {
 *   player_id: int,       // Player for which this view was created.
 *   hand: [card],
 *   discards: [[card]],   // Cards discarded by each player
 *   player_alive: [bool], // Whether each player is still in the round.
 *   num_wins: as above,   // Take length for the number of players
 *   num_players: as above,
 *   current_player: as above,
 * }
 * 
 * Representation of action:
 * {
 *   card: card,
 *   target: player (optional),  // For cards 1, 2, 3, 5, 6
 *   guess: card (optional),     // For guard
 * }
 *
 * A card is an int from 1 to 8 with the following meanings:
 * - 1: Guard. Guess a player's card to try to eliminate them.
 * - 2: Priest. Look at another player's hand.
 * - 3: Baron. Compare hands with another player; lower one loses.
 * - 4: Handmaid. Ignore effects until your next turn.
 * - 5: Prince. Force player to discard their hand.
 * - 6: King. Trade hands with a player.
 * - 7: Countess. Must discard if you have the King or Prince.
 * - 8: Princess. You lose if you discard this.
 */

/* "Utility Functions" */
function make_deck() {
  const deck = [1,1,1,1,1,2,2,3,3,4,4,5,5,6,7,8];
  // Fisher Yates shuffle
  for (let i = 1; i < deck.length; i += 1) {
    const j = Math.floor(Math.random() * (i+1));
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }
  return deck;
}

function is_handmaided(player_discards) {
  return (
    (player_discards.length > 0) &&
    player_discards[player_discards.length - 1]
  );
}

function initial_state(players) {
  if (players < 2 || players > 4) {
    throw 'Invalid number of players';
  }

  return {
    deck:     make_deck(),
    hands:    new Array(players).fill([]),
    discards: new Array(players).fill([]),
    num_wins: new Array(players.fill(0),      // Number of wins for each player
    num_players: players,
    current_player: 0,
  }
}

function player_view(game_state, player_id) {
  return {
    ...game_state,
    player_id,
    hands: undefined, // Hide hands information from player
    hand: game_state.hands[player_id],
    player_alive: game_state.hands.map((h) => h.length > 0),
  };
}

function current_players(game_state) {
  return [game_state.current_player];
}

function has_legal_action(game_view) {
  // NOT ACTUALLY USED LOL
  return game_view.player === game_view.current_player;
}

function is_action_legal(game_view, action) {
  const all_others_handmaided = true;
  for (let i = 0; i < game_view.num_players; i++) {
    if (i !== game_view.current_player && is_handmaided(game_view.discards[i])) {
      all_others_handmaided = false;
      break;
    }
  }

  return (
    game_view.player_id === game_view.current_player
    && game_view.hand.includes(action.card)
    && (
      // Target is undefined...
      !action.target 
      // Or specified as none, and everyone else is handmaided...
      || (action.target === -1 && all_others_handmaided)
      // Or specified, still in the game, and not handmaided.
      || (
        action.target < game_view.num_wins.length
        && action.target >= 0
        && game_view.player_alive[action.target]
        && !is_handmaided(game_view.discards[action.target])
      )
    )
    && (!action.guess || action.guess > 1)
  );
}

function perform_action(game_state, player_id, action) {
  // Copy game state for safety
  game_state = { ...game_state };
  if (!is_action_legal(player_view(game_state, player_id), action)) {
    throw 'Illegal action';
  }
  switch (action.card) {
    // TODO: Game logic
  }
  return game_state;
}

function is_game_finished(game_state) {
}

function winners(game_state) {
}

module.exports = {
  initial_state,
  player_view,
  current_players,
  has_legal_action,
  is_action_legal,
  perform_action,
  is_game_finished,
  winners,
};
