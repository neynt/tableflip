/* Rules for Connect 5
 *
 * Representation of game state:
 * {
 *   systems: {
 *     int: {
 *       stars: [int],
 *       ships: [int]
 *     }
 *   },
 *   stash: [int],
 *   players: int,
 *   current_player: int,
 *   next_system: int,
 *   sacrifice_actions: int,
 *   sacrifice_colour: int,
 * }
 * Pyramids are represented as colour * 3 + size
 * Ships are represented as player * 12 + pyramid
 * System ids are ints, 0 <= id < players are homeworlds
 * Stash maps pyramid numbers to number of that pyramid remaining
 * Colours are 0: RED, 1: YELLOW, 2: GREEN, 3: BLUE
 *
 * Representation of game view:
 * {
 *   player: int,
 *   everything else: as above
 * }
 *
 * Representation of action:
 * {
 *   type: int,
 *   system: int || null,
 *   ship: int || null,
 *   target: int || null
 * } ||
 * Types are:
 * 0: PASS (used only to cancel use of remaining sacrifice actions)
 * 1: ATTACK {system, target}         // target is ship
 * 2: DISCOVER {system, ship, target} // target is pyramid
 * 3: TRAVEL {system, ship, target}   // target is system id
 * 4: BUILD {system, target}          // target is colour
 * 5: TRADE {system, ship, target}    // target is colour
 * 6: SACRIFICE {system, ship}
 * 7: CATASTROPHE {system, target}    // target is colour
 * 8: HOMEWORLD {stars, ship}         // stars is array of pyramids
 */

const RED = 0;
const YELLOW = 1;
const GREEN = 2;
const BLUE = 3;
const PASS = 0;
const ATTACK = 1;
const DISCOVER = 2;
const TRAVEL = 3;
const BUILD = 4;
const TRADE = 5;
const SACRIFICE = 6;
const CATASTROPHE = 7;
const HOMEWORLD = 8;

function ship_player(ship) {
  return Math.floor(ship / 12);
}

function pyramid_colour(pyramid) {
  return Math.floor(pyramid / 3) % 4;
}

function pyramid_size(pyramid) {
  return pyramid % 3;
}

function is_player_alive(game_state, player) {
  return (game_state.systems[player] &&
    game_state.systems[player].ships.some(ship => ship_player(ship) === player)) ||
    game_state.next_system <= player;
}

function build_colour_available(system, player, colour) {
  for (let i = 0; i < system.ships.length; i += 1) {
    if (pyramid_colour(system.ships[i]) === colour &&
        ship_player(system.ships[i]) === player) {
      return true;
    }
  }
  return false;
}

function colour_available(system, player, colour) {
  for (let i = 0; i < system.stars.length; i += 1) {
    if (pyramid_colour(system.stars[i]) === colour) {
      return true;
    }
  }
  if (build_colour_available(system, player, colour)) {
    return true;
  }
  return false;
}

function largest_ship_size(system, player) {
  let largest = -1;
  for (let i = 0; i < system.ships.length; i += 1) {
    if (ship_player(system.ships[i]) === player) {
      largest = Math.max(largest, pyramid_size(system.ships[i]));
    }
  }
  return largest;
}

function systems_connected(stars1, stars2) {
  for (let i = 0; i < stars1.length; i += 1) {
    for (let j = 0; j < stars2.length; j += 1) {
      if (pyramid_size(stars1[i]) === pyramid_size(stars2[j])) {
        return false;
      }
    }
  }
  return true;
}

function build_size(stash, colour) {
  for (let i = 0; i < 3; i += 1) {
    if (stash[(colour * 3) + i] > 0) {
      return i;
    }
  }
  return -1;
}

function pyramids_of_colour(system, colour) {
  let count = 0;
  for (let i = 0; i < system.stars.length; i += 1) {
    if (pyramid_colour(system.stars[i]) === colour) {
      count += 1;
    }
  }
  for (let i = 0; i < system.ships.length; i += 1) {
    if (pyramid_colour(system.ships[i]) === colour) {
      count += 1;
    }
  }
  return count;
}

function initial_state(players) {
  if (players < 2) {
    throw 'Invalid number of players';
  }

  const stash = [];
  for (let i = 0; i < 12; i += 1) {
    stash.push(players + 1);
  }

  return {
    systems: {},
    stash,
    players,
    current_player: 0,
    next_system: 0,
    sacrifice_actions: 0,
    sacrifice_colour: 0,
  };
}

function player_view(game_state, player) {
  return {
    player,
    systems: game_state.systems,
    stash: game_state.stash,
    players: game_state.players,
    current_player: game_state.current_player,
    next_system: game_state.next_system,
    sacrifice_actions: game_state.sacrifice_actions,
    sacrifice_colour: game_state.sacrifice_colour,
  };
}

function is_game_finished(game_state) {
  if (game_state.next_system < game_state.players) {
    return false;
  }
  let remaining_players = 0;
  for (let i = 0; i < game_state.players; i += 1) {
    if (is_player_alive(game_state, i)) {
      remaining_players += 1;
    }
  }
  return remaining_players <= 1;
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
  function action_colour_available(colour) {
    return (game_view.sacrifice_actions === 0 &&
              colour_available(game_view.systems[action.system], game_view.player, colour)) ||
           (game_view.sacrifice_actions > 0 && game_view.sacrifice_colour === colour);
  }
  // Game must not be over.
  if (is_game_finished(game_view)) {
    return false;
  }
  // The view's player must be the current player.
  if (game_view.player !== game_view.current_player) {
    return false;
  }
  // System must exist, or actual must be a pass or a homeworld.
  if (action.type !== PASS && action.type !== HOMEWORLD && !game_view.systems[action.system]) {
    return false;
  }
  if (action.type === PASS) {
    return game_view.sacrifice_actions > 0;
  } else if (action.type === ATTACK) {
    // Red must be available to player.
    if (!action_colour_available(RED)) {
      return false;
    }
    // Target must not be owned by player.
    if (ship_player(action.target) === game_view.player) {
      return false;
    }
    // Target must exist in the system.
    if (game_view.systems[action.system].ships.indexOf(action.target) === -1) {
      return false;
    }
    // Player must have equal or larger ship in system.
    if (largest_ship_size(game_view.systems[action.system], game_view.player) <
        pyramid_size(action.target)) {
      return false;
    }
    return true;
  } else if (action.type === DISCOVER) {
    // Yellow must be available to player.
    if (!action_colour_available(YELLOW)) {
      return false;
    }
    // Ship must exist in the system and be owned by player.
    if (game_view.systems[action.system].ships.indexOf(action.ship) === -1 ||
        ship_player(action.ship) !== game_view.player) {
      return false;
    }
    // Target must be in stash.
    if (!(action.target >= 0 && action.target < 12 && game_view.stash[action.target] > 0)) {
      return false;
    }
    // System must be connected to target.
    if (!systems_connected(game_view.systems[action.system].stars, [action.target])) {
      return false;
    }
    return true;
  } else if (action.type === TRAVEL) {
    // Yellow must be available to player.
    if (!action_colour_available(YELLOW)) {
      return false;
    }
    // Ship must exist in the system and be owned by player.
    if (game_view.systems[action.system].ships.indexOf(action.ship) === -1 ||
        ship_player(action.ship) !== game_view.player) {
      return false;
    }
    // Target must be a system.
    if (!game_view.systems[action.target]) {
      return false;
    }
    // System must be connected to target.
    if (!systems_connected(game_view.systems[action.system].stars,
                           game_view.systems[action.target].stars)) {
      return false;
    }
    return true;
  } else if (action.type === BUILD) {
    // Green must be available to player.
    if (!action_colour_available(GREEN)) {
      return false;
    }
    // Target colour must be available to player.
    if (!build_colour_available(game_view.systems[action.system], game_view.player,
                                action.target)) {
      return false;
    }
    // Target colour must have a pyramid in the stash.
    if (build_size(game_view.stash, action.target) === -1) {
      return false;
    }
    return true;
  } else if (action.type === TRADE) {
    // Blue must be available to player.
    if (!action_colour_available(BLUE)) {
      return false;
    }
    // Ship must exist in the system and be owned by player.
    if (game_view.systems[action.system].ships.indexOf(action.ship) === -1 ||
        ship_player(action.ship) !== game_view.player) {
      return false;
    }
    // Target colour must be different than current colour.
    if (pyramid_colour(action.ship) === action.target) {
      return false;
    }
    // Pyramid of correct size and colour must be available in stash.
    if (!game_view.stash[(action.target * 3) + pyramid_size(action.ship)]) {
      return false;
    }
    return true;
  } else if (action.type === SACRIFICE) {
    // Ship must exist in the system and be owned by player.
    if (game_view.systems[action.system].ships.indexOf(action.ship) === -1 ||
        ship_player(action.ship) !== game_view.player) {
      return false;
    }
    // Must not already have sacrificed this term.
    if (game_view.sacrifice_actions !== 0) {
      return false;
    }
    return true;
  } else if (action.type === CATASTROPHE) {
    // Must be at least 4 pyramids of colour in system.
    if (pyramids_of_colour(game_view.systems[action.system], action.target) < 4) {
      return false;
    }
    return true;
  } else if (action.type === HOMEWORLD) {
    // Must not have already constructed homeworld.
    if (game_view.next_system !== game_view.player) {
      return false;
    }
    // Must be exactly two stars.
    if (action.stars.length !== 2) {
      return false;
    }
    const new_stash = game_view.stash.slice();
    for (let i = 0; i < 2; i += 1) {
      if (!new_stash[action.stars[i]]) {
        return false;
      }
      new_stash[action.stars[i]] -= 1;
    }
    if (!new_stash[action.ship]) {
      return false;
    }
    new_stash[action.ship] -= 1;
    return true;
  }
  return false;
}

function perform_action(old_game_state, player, action) {
  // Verify that the action is legal.
  if (!is_action_legal(player_view(old_game_state, player), action)) {
    throw 'Illegal action';
  }
  // Copy game state for safety.
  const game_state = JSON.parse(JSON.stringify(old_game_state));

  function destroy_system(id) {
    const system = game_state.systems[id];
    for (let i = 0; i < system.stars.length; i += 1) {
      game_state.stash[system.stars[i]] += 1;
    }
    for (let i = 0; i < system.ships.length; i += 1) {
      game_state.stash[system.ships[i] % 12] += 1;
    }
    delete game_state.systems[id];
  }

  if (action.type === PASS) {
    game_state.sacrifice_actions = 0;
  } else if (action.type === ATTACK) {
    const index = game_state.systems[action.system].ships.indexOf(action.target);
    game_state.systems[action.system].ships[index] = (player * 12) + (action.target % 12);
  } else if (action.type === DISCOVER) {
    const index = game_state.systems[action.system].ships.indexOf(action.ship);
    game_state.systems[action.system].ships.splice(index, 1);
    game_state.stash[action.target] -= 1;
    game_state.systems[game_state.next_system] = {
      stars: [action.target],
      ships: [action.ship],
    };
    game_state.next_system += 1;
  } else if (action.type === TRAVEL) {
    const index = game_state.systems[action.system].ships.indexOf(action.ship);
    game_state.systems[action.system].ships.splice(index, 1);
    game_state.systems[action.target].ships.push(action.ship);
  } else if (action.type === BUILD) {
    const size = build_size(game_state.stash, action.target);
    const pyramid = (3 * action.target) + size;
    game_state.stash[pyramid] -= 1;
    game_state.systems[action.system].ships.push((12 * player) + pyramid);
  } else if (action.type === TRADE) {
    const pyramid = (3 * action.target) + pyramid_size(action.ship);
    const index = game_state.systems[action.system].ships.indexOf(action.ship);
    game_state.stash[pyramid] -= 1;
    game_state.stash[action.ship % 12] += 1;
    game_state.systems[action.system].ships[index] = (12 * player) + pyramid;
  } else if (action.type === SACRIFICE) {
    const index = game_state.systems[action.system].ships.indexOf(action.ship);
    game_state.systems[action.system].ships.splice(index, 1);
    game_state.stash[action.ship % 12] += 1;
    game_state.sacrifice_actions = pyramid_size(action.ship) + 1;
    game_state.sacrifice_colour = pyramid_colour(action.ship);
  } else if (action.type === CATASTROPHE) {
    const system = game_state.systems[action.system];
    for (let i = 0; i < system.stars.length; i += 1) {
      if (pyramid_colour(system.stars[i]) === action.target) {
        game_state.stash[system.stars[i]] += 1;
      }
    }
    for (let i = 0; i < system.ships.length; i += 1) {
      if (pyramid_colour(system.ships[i]) === action.target) {
        game_state.stash[system.ships[i] % 12] += 1;
      }
    }
    game_state.systems[action.system] = {
      stars: system.stars.filter(star => pyramid_colour(star) !== action.target),
      ships: system.ships.filter(ship => pyramid_colour(ship) !== action.target),
    };
  } else if (action.type === HOMEWORLD) {
    for (let i = 0; i < 2; i += 1) {
      game_state.stash[action.stars[i]] -= 1;
    }
    game_state.stash[action.ship] -= 1;
    game_state.systems[game_state.next_system] = {
      stars: action.stars,
      ships: [(12 * player) + action.ship],
    };
    game_state.next_system += 1;
  }
  if (action.type !== PASS && action.type !== HOMEWORLD) {
    if (game_state.systems[action.system].stars.length === 0 ||
        game_state.systems[action.system].ships.length === 0) {
      destroy_system(action.system);
    }
  }
  if (action.type !== SACRIFICE && action.type !== CATASTROPHE) {
    if (game_state.sacrifice_actions > 0) {
      game_state.sacrifice_actions -= 1;
    }
    if (game_state.sacrifice_actions === 0) {
      // Advance current player.
      const last_player = game_state.current_player;
      while (!is_player_alive(game_state, game_state.current_player) ||
             game_state.current_player === last_player) {
        game_state.current_player = (game_state.current_player + 1) % game_state.players;
        if (game_state.current_player === last_player) {
          break;
        }
      }
    }
  }
  return game_state;
}

function winners(game_state) {
  if (is_game_finished(game_state)) {
    const wins = [];
    for (let i = 0; i < game_state.players; i += 1) {
      if (is_player_alive(game_state, i)) {
        wins.push(i);
      }
    }
    return wins;
  }
  return [];
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
