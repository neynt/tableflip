/* Rules for Hanabi
 *
 * Representation of game state:
 * {
 *   deck: [card],
 *   plays: [int],
 *   discards: [card],
 *   hands: [[card]],
 *   hinted: [[{
 *     colour: int,
 *     number: int
 *   }]],
 *   current_player: int,
 *   hints: int,
 *   lives: int
 * }
 * A card is an int, 0 <= card < 5 * NUM_COLOURS, === colour * 5 + number - 1.
 * Plays is an array of size NUM_COLOURS contains the highest card played
 * in each colour.
 * Hint dictionaries start out empty (default values are undefined).
 *
 * Representation of game view:
 * {
 *   player: int,
 *   deck_size: int,
 *   plays: as above,
 *   discards: as above,
 *   hands: as above but hand[player] === [],
 *   hinted: as above,
 *   current_player: as above,
 *   hints: as above,
 *   lives: as above
 * }
 *
 * Representation of an action is either:
 * {
 *   type: "play",
 *   index: int
 * }
 * OR
 * {
 *   type: "discard",
 *   index: int
 * }
 * OR
 * {
 *   type: "hint",
 *   player: int,
 *   colour: int || undefined,
 *   number: int || undefined
 * }
 */

function blank_hand(hand) {
  const blank = hand.slice();
  for (let i = 0; i < blank.length; i += 1) {
    blank[i] = -1;
  }
  return blank;
}

function make_card(colour, number) {
  return (colour * 5) + (number - 1);
}

function card_colour(card) {
  return Math.floor(card / 5);
}

function card_number(card) {
  return (card % 5) + 1;
}

const NUM_COLOURS = 5;
const CARD_COUNTS = [3, 2, 2, 2, 1];
const MAX_HINTS = 8;
const START_LIVES = 3;

function initial_state(players) {
  if (players < 2 || players > 5) {
    throw 'Invalid number of players';
  }

  const cards_in_hand = players <= 3 ? 5 : 4;

  const deck = [];
  const plays = [];
  for (let i = 0; i < NUM_COLOURS; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      for (let k = 0; k < CARD_COUNTS[j]; k += 1) {
        deck.push(make_card(i, j + 1));
      }
    }
    plays.push(0);
  }
  for (let i = deck.length - 1; i > 1; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }

  const hands = [];
  const hinted = [];
  for (let i = 0; i < players; i += 1) {
    hands.push([]);
    hinted.push([]);
    for (let j = 0; j < cards_in_hand; j += 1) {
      hands[i].push(deck.pop());
      hinted[i].push({});
    }
  }

  return {
    deck,
    plays,
    discards: [],
    hands,
    hinted,
    current_player: 0,
    hints: MAX_HINTS,
    lives: START_LIVES,
  };
}

function player_view(game_state, player) {
  const new_hands = [];
  for (let i = 0; i < game_state.hands.length; i += 1) {
    if (player >= 0 && player < game_state.hands.length && i !== player) {
      new_hands.push(game_state.hands[i]);
    } else {
      new_hands.push(blank_hand(game_state.hands[i]));
    }
  }
  return {
    player,
    deck_size: game_state.deck.length,
    plays: game_state.plays,
    discards: game_state.discards,
    hands: new_hands,
    hinted: game_state.hinted,
    current_player: game_state.current_player,
    hints: game_state.hints,
    lives: game_state.lives,
  };
}

function won_game(game_state) {
  for (let i = 0; i < NUM_COLOURS; i += 1) {
    if (game_state.plays[i] < 5) {
      return false;
    }
  }
  return true;
}

function is_game_finished(game_state) {
  return game_state.lives === 0 ||
      ((game_state.deck && game_state.deck.length === 0) ||
          game_state.deck_size === 0) ||
      won_game(game_state);
}

function winners(game_state) {
  if (is_game_finished(game_state)) {
    if (won_game(game_state)) {
      const win = [];
      for (let i = 0; i < game_state.hands.length; i += 1) {
        win.push(i);
      }
      return win;
    }
  }
  return [];
}

function current_players(game_state) {
  if (!is_game_finished(game_state)) {
    return [game_state.current_player];
  }
  return [];
}

function has_legal_action(game_view) {
  return !is_game_finished(game_view) &&
         game_view.player === game_view.current_player;
}

function is_action_legal(game_view, action) {
  // Game must not be over.
  if (is_game_finished(game_view)) {
    // Calling is_game_finished on a game_view is not generally safe, but in
    // this game, game_view has a superset of the properties of game_state.
    return false;
  }

  // The player must be the current player.
  if (game_view.player !== game_view.current_player) {
    return false;
  }

  if (action.type === 'play' || action.type === 'discard') {
    // Index must be within hand.
    if (action.index < 0 ||
        action.index >= game_view.hands[game_view.player].length) {
      return false;
    }

    // Must have a used hint to discard.
    if (action.type === 'discard' && game_view.hints === MAX_HINTS) {
      return false;
    }

    return true;
  } else if (action.type === 'hint') {
    // There must be a hint available;
    if (game_view.hints === 0) {
      return false;
    }

    // Can't give a hint to self.
    if (game_view.player === action.player) {
      return false;
    }

    // Must give either a colour hint or a number hint, but not both.
    if (action.colour === undefined ?
        action.number === undefined :
        action.number !== undefined) {
      return false;
    }

    // If giving a colour hint, must be a valid colour.
    if (action.number === undefined &&
        (action.colour < 0 || action.colour >= NUM_COLOURS)) {
      return false;
    }

    // If giving a number hint, must be a valid number.
    if (action.colour === undefined &&
        (action.number < 1 || action.number > 5)) {
      return false;
    }

    return true;
  }
  return false;
}

function perform_action(game_state, player, action) {
  // Verify that the action is legal.
  if (!is_action_legal(player_view(game_state, player), action)) {
    throw 'Illegal action';
  }

  // Copy game state for safety.
  const game_copy = JSON.parse(JSON.stringify(game_state));

  if (action.type === 'play' || action.type === 'discard') {
    const card = game_copy.hands[player].splice(action.index, 1)[0];
    game_copy.hinted[player].splice(action.index, 1);

    if (action.type === 'play') {
      // Check whether the play is valid.
      if (game_copy.plays[card_colour(card)] === card_number(card) - 1) {
        game_copy.plays[card_colour(card)] += 1;
      } else {
        game_copy.lives -= 1;
        game_copy.discards.push(card);
      }
    } else {
      game_copy.discards.push(card);
      game_copy.hints += 1;
    }

    if (game_copy.deck.length !== 0) {
      game_copy.hands[player].push(game_copy.deck.pop());
      game_copy.hinted[player].push({});
    }
  } else { // action.type === 'hint'
    for (let i = 0; i < game_copy.hands[action.player].length; i += 1) {
      if (action.colour !== undefined) {
        if (card_colour(game_copy.hands[action.player][i]) === action.colour) {
          game_copy.hinted[action.player][i].colour = action.colour;
        }
      } else if (card_number(game_copy.hands[action.player][i]) === action.number) {
        game_copy.hinted[action.player][i].number = action.number;
      }
    }
    game_copy.hints -= 1;
  }

  game_copy.current_player = (game_copy.current_player + 1) %
      game_copy.hands.length;

  return game_copy;
}

module.exports = {
  /* Creates initial game state.
   * @param players Number of players in the game.
   * @throws something if the game does not support that number of players.
   * @returns Object representating initial game state.
   */
  initial_state,

  /* Gets a view of the game state for given player.
   * @param game_state Game state.
   * @param player ID of the player who is viewing the game.
   * @returns Object representating portion of game state visible to the player.
   */
  player_view,

  /* Gets a list of players who may make actions at the current time.
   * @param game_state Game state.
   * @returns Array of player IDs.
   */
  current_players,

  /* Determines whether the current player can make any actions.
   * Similar to current_players, but only requires a view; in general, a player
   * may not be allowed to know which other players may currently make actions.
   * @param game_view View of the game for the player.
   * @returns boolean, whether or not the player may make an action.
   */
  has_legal_action,

  /* Determines whether an action is currently legal.
   * @param game_view View of the game for the player making the action.
   * @param action Object representing action.
   * @returns boolean, whether or not action is legal.
   */
  is_action_legal,

  /* Applies an action to a game state to produce a new game state.
   * @param game_state Game state.
   * @param player ID of the player making the action.
   * @param action Object representating action.
   * @throws something if the action is not legal.
   * @returns Object representing new state of the game.
   */
  perform_action,

  /* Determines whether the game is finished.
   * @param game_state Game state.
   * @returns boolean, whether the game is over or not.
   */
  is_game_finished,

  /* Gets a list of winning players.
   * @param game_state Game state.
   * @returns Arry of player IDs. Empty if no player has won yet.
   */
  winners,
};
