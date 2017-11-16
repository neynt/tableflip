/* Rules for Love Letter.
 *
 * Representation of game state:
 * {
 *   deck: [card],
 *   hands: [[card]],
 *   discards: [[card]],
 *   num_wins: [int],       // Number of wins for each player
 *   priested_player: int,  // Player whose hand current_player can see due to priest
 *   log: [string],         // Array of strings describing in-game actions
 *   num_players: int,
 *   current_player: int,
 * }
 *
 * Representation of game view:
 * {
 *   player_id: int,       // Player for which this view was created.
 *   cards_left: int,      // Number of cards left in deck
 *   hands: [[card]],      // everyone's hands; nulled out if player can't see the hand
 *   discards: [[card]],   // Cards discarded by each player
 *   player_alive: [bool], // Whether each player is still in the round.
 *   log: as above,
 *   num_wins: as above,
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
  const deck = [1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 7, 8];
  // Fisher-Yates shuffle
  for (let i = 1; i < deck.length; i += 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[j], deck[i]] = [deck[i], deck[j]];
  }
  return deck;
}

function pickup_card(game_state, p_id) {
  game_state.hands[p_id].push(game_state.deck.shift());
}

function discard_card(game_state, p_id) {
  // Discard whatever card is in p_id's hand.
  // Returns the discarded card.
  const card = game_state.hands[p_id].shift();
  game_state.discards[p_id].push(card);
  return card;
}

function kill_player(game_state, p_id) {
  /* eslint-disable no-param-reassign */
  Array.prototype.push.apply(game_state.discards[p_id], game_state.hands[p_id]);
  game_state.hands[p_id].length = 0;
  /* eslint-enable */
}

function is_handmaided(player_discards) {
  return (
    (player_discards.length > 0)
    && player_discards[player_discards.length - 1] === 4
  );
}

function num_wins_required(num_players) {
  if (num_players === 2) return 7;
  if (num_players === 3) return 5;
  if (num_players === 4) return 4;
  if (num_players === 5) return 3;
  throw 'Invalid number of players in num_wins_required';
}

function new_round(cur_game_state) {
  const game_state = cur_game_state;
  const { num_players } = game_state;
  game_state.deck = make_deck();
  game_state.hands = new Array(num_players);
  for (let i = 0; i < num_players; i += 1) {
    game_state.hands[i] = [];
    pickup_card(game_state, i);
  }
  game_state.discards = new Array(num_players).fill([]);
  game_state.priested_player = null;
  return game_state;
}

function initial_state(players) {
  if (players < 2 || players > 4) {
    throw 'Invalid number of players';
  }

  const current_player = 0; // TODO: different current player?
  const game_state = {
    log: ['Game started.'],
    num_wins: new Array(players).fill(0), // Number of wins for each player
    num_players: players,
    current_player,
  };
  new_round(game_state, current_player);
  pickup_card(game_state, game_state.current_player);
  return game_state;
}

function player_view(game_state, player_id) {
  return {
    player_id,
    log: game_state.log,
    cards_left: game_state.deck.length,
    hands: game_state.hands.map((h, i) => h.map(c => (
      (i === player_id)
      || (game_state.priested_player === i && game_state.current_player === player_id)
      ? c : null
    ))), // Hide card information from player
    discards: game_state.discards,
    player_alive: game_state.hands.map(h => h.length > 0),
    num_wins: game_state.num_wins,
    num_players: game_state.num_players,
    priested_player: game_state.priested_player,
    current_player: game_state.current_player,
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
  let all_others_handmaided = true;
  for (let i = 0; i < game_view.num_players; i += 1) {
    if (i !== game_view.current_player && is_handmaided(game_view.discards[i])) {
      all_others_handmaided = false;
      break;
    }
  }

  // Player must be current player
  if (game_view.player_id !== game_view.current_player) return false;
  // If the player just played a priest, they're pressing "continue" and their
  // action will be rewritten to continue the game. All other bets are off.
  if (game_view.priested_player != null) return true;
  // Player must have selected card
  if (!game_view.hands[game_view.player_id].includes(action.card)) return false;
  if (action.target) {
    // Action cannot be no-target if someone isn't handmaided
    if (action.target === -1 && !all_others_handmaided) return false;
    // Target must be valid, alive, and not handmaided
    if (!(
      action.target >= 0
      && action.target < game_view.num_players
      && game_view.player_alive[action.target]
      && !is_handmaided(game_view.discards[action.target])
    )) return false;
  }
  if (action.guess) {
    // Guess must be "no-guess" or on a non-guard
    if (!(action.guess === -1 || (action.guess >= 2 && action.guess <= 8))) return false;
  }
  if (game_view.hands[game_view.player_id].includes(7)) {
    // Presence of a countess means you can't play guard or king
    if (action.card === 5 || action.card === 6) return false;
  }
  return true;
}

function winners(game_state) {
  const required_wins = num_wins_required(game_state.num_players);
  const result = [];
  for (let i = 0; i < game_state.num_players; i += 1) {
    if (game_state.num_wins[i] >= required_wins) result.push(i);
  }
  return result;
}

function is_game_finished(game_state) {
  return winners(game_state).length > 0;
}

function play_card(game_state, player_id, action) {
  // Mutates game_state.
  // Returns: true if we should advance the turn.
  /* eslint-disable no-param-reassign */

  // Discard the chosen card.
  const my_discards = game_state.discards[player_id];
  const my_hand = game_state.hands[player_id];
  my_discards.push(my_hand.splice(my_hand.indexOf(action.card), 1)[0]);

  switch (action.card) {
    case 1:
      if (action.target === -1) {
        game_state.log.push(`Player ${player_id} discards a 1.`);
        break;
      }
      if (game_state.hands[action.target].includes(action.guess)) {
        // Guess was correct. Fuck 'em up, boss!
        game_state.log.push(
          `Player ${player_id} guesses correctly ` +
          `that Player ${action.target} has a ${action.guess}.`);
        kill_player(game_state, action.target);
      } else {
        game_state.log.push(
          `Player ${player_id} guesses incorrectly ` +
          `that Player ${action.target} has a ${action.guess}.`);
      }
      break;
    case 2:
      // Look at another player's hand.
      game_state.priested_player = action.target;
      game_state.log.push(
        `Player ${player_id} uses a 2 to see Player ${action.target}'s hand.`);
      // Does not advance the turn. Continued at unpriest().
      return false;
    case 3: {
      // Compare hands; lower loses.
      const my_card = game_state.hands[player_id][0];
      const their_card = game_state.hands[action.target][0];
      if (my_card > their_card) {
        kill_player(game_state, action.target);
        game_state.log.push(
          `Player ${player_id} uses a 3 to compare hands with Player ${action.target}. ` +
          `Player ${player_id} is defeated.`);
      } else if (my_card < their_card) {
        kill_player(game_state, player_id);
        game_state.log.push(
          `Player ${player_id} uses a 3 to compare hands with Player ${action.target}. ` +
          `Player ${action.target} is defeated.`);
      } else {
        game_state.log.push(
          `Player ${player_id} uses a 3 to compare hands with Player ${action.target}. They are equal.`);
      }
      break;
    }
    case 4:
      // Does nothing. Handmaid status is computed from discards.
      game_state.log.push(`Player ${player_id} plays a 4.`);
      break;
    case 5: {
      // Force discard.
      const discarded_card = discard_card(game_state, action.target);
      if (discarded_card === 8) {
        kill_player(game_state, action.target);
      } else {
        pickup_card(game_state, action.target);
      }
      game_state.log.push(
        `Player ${player_id} plays a 5, forcing Player ${action.target} ` +
        `to discard their ${discarded_card}.`);
      break;
    }
    case 6: {
      // Trade hands.
      const their_hand = game_state.hands[action.target];
      const my_card = my_hand.pop();
      const their_card = their_hand.pop();
      my_hand.push(their_card);
      their_hand.push(my_card);
      game_state.log.push(
        `Player ${player_id} plays a 6, trading hands with Player ${action.target}.`);
      break;
    }
    case 7:
      // Does nothing except force you to play it.
      game_state.log.push(`Player ${player_id} plays a 7. Ooooh.`);
      break;
    case 8:
      // Lose game.
      game_state.log.push(`Player ${player_id} plays their Princess, losing the game.`);
      kill_player(game_state, player_id);
      break;
    default:
      throw 'Invalid card, not caught by is_action_legal!';
  }
  return true;
}

function unpriest(game_state, player_id, action) {
  // Mutates game_state and action.
  /* eslint-disable no-param-reassign */
  action.card = 2;
  action.target = game_state.priested_player;
  game_state.priested_player = null;
}

function add_point(game_state, winning_player_id) {
  // Mutates game_state.
  /* eslint-disable no-param-reassign */
  game_state.num_wins[winning_player_id] += 1;
  if (!is_game_finished(game_state)) {
    new_round(game_state);
  } else {
    game_state.log[game_state.log.length - 1] += ` Player ${winning_player_id} wins the game!`;
  }
}

function perform_action(old_game_state, player_id, action) {
  // Copy game state for safety
  const game_state = JSON.parse(JSON.stringify(old_game_state));
  if (!is_action_legal(player_view(game_state, player_id), action)) {
    throw 'Illegal action';
  } else if (is_game_finished(game_state)) {
    throw 'Game finished';
  }

  // If priested: Turn continues next time priesting player makes any action
  if (game_state.priested_player != null) {
    unpriest(game_state, player_id, action);
  } else if (!play_card(game_state, player_id, action)) {
    return game_state;
  }

  let next_player_id = (player_id + 1) % game_state.num_players;
  while (game_state.hands[next_player_id].length === 0 && next_player_id !== player_id) {
    next_player_id = (next_player_id + 1) % game_state.num_players;
  }
  if (game_state.hands.filter(h => h.length > 0).length === 1) {
    // Only one player left. They win!
    game_state.log[game_state.log.length - 1] += ` Player ${next_player_id} is the last one standing and wins the round!`;
    add_point(game_state, next_player_id);
  } else if (game_state.deck.length <= 1) {
    // If there are 0 or 1 cards remaining in the deck, the player with the
    // highest card wins the round.
    let winner_id = null;
    let best_card = -1;
    for (let i = 0; i < game_state.num_players; i += 1) {
      const card = (game_state.hands[i].length > 0 && game_state.hands[i][0]) || -1;
      if (card > best_card) {
        winner_id = i;
        best_card = card;
      }
    }
    game_state.log[game_state.log.length - 1] += ` Player ${winner_id} has the highest card (${best_card}) and wins the round!`;
    add_point(game_state, winner_id);
  }
  game_state.current_player = next_player_id;
  pickup_card(game_state, game_state.current_player);
  return game_state;
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
