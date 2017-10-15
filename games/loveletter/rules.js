/* Rules for Love Letter.
 *
 * Representation of game state:
 * {
 *   deck: [card],
 *   hands: [[card]],
 *   discards: [[card]],
 *   num_wins: [int],       // Number of wins for each player
 *   priested_player: card, // Player whose hand current_user can see due to priest
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
    (player_discards.length > 0)
    && player_discards[player_discards.length - 1] === 4
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
    priested_player: -1,
    current_player: 0,
  }
}

function player_view(game_state, player_id) {
  return {
    ...game_state,
    player_id,
    hands: game_state.hands.map((h, i) => {
      if (game_state.priested_player === i && game_state.current_player === player_id) {
        return h;
      } else {
        return null;
      }
    }), // Hide hands information from player
    hand: game_state.hands[player_id],
    player_alive: game_state.hands.map((h) => h.length > 0),
  };
}

function current_players(game_state) {
  return [game_state.current_player];
}

function has_legal_action(game_view) {
  // NOT ACTUALLY USED LOL
  return game_view.player_id === game_view.current_player;
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
    // If the player guessed something for the guard, it can't be a guard
    && (!action.guess || action.guess === -1 || action.guess > 1)
    // If the player has a 7, they can't have played 5 or 6.
    && (!game_view.hand.includes(7) || action.card === 5 action.card === 6)
  );
}

function perform_action(game_state, player_id, action) {
  // Copy game state for safety
  game_state = { ...game_state };
  if (!is_action_legal(player_view(game_state, player_id), action)) {
    throw 'Illegal action';
  }

  function kill(player_id) {
    Array.prototype.push.apply(game_state.discards[action.target], game_state.hands[action.target]);
    game_state.hands[action.target] = [];
  }
  function discard_card(player_id) {
  }
  function pickup_card(player_id) {
  }

  // TODO: Discard the played card.
  const my_discards = game_state.discards[player_id]
  const my_hand = game_state.hands[player_id]
  my_discards.push(my_hand.splice(my_hand.indexOf(action.card), 1)[0]);

  switch (action.card) {
    case 1:
      if (action.target === -1) break;
      if (game_state.hands[action.target][0] === action.guess) {
        // Guess was correct. Fuck 'em up, boss!
        kill(action.target);
      }
      break;
    case 2:
      // Look at another player's hand.
      // TODO: don't advance player id
      game_state.priested_player = action.target;
      break;
    case 3:
      // Compare hands; lower loses.
      const my_card = game_state.hands[player_id][0];
      const their_card = game_state.hands[action.target][0];
      if (my_card > their_card) {
        kill(action.target);
      } else if (my_card < their_card) {
        kill(player_id);
      }
      break;
    case 4:
      // Does nothing. Handmaid status is computed from discards.
      break;
    case 5:
      // Force discard.
      break;
    case 6:
      // Trade hands.
      break;
    case 7:
      // Does nothing except force you to play it.
      break;
    case 8:
      // Lose game.
      kill(player_id);
      break;
    default:
      throw 'Invalid card, not caught by is_action_legal!'
  }
  let next_player_id = player_id;
  // TODO: Move on to the next player.
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
