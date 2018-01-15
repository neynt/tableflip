/* Rules for Quarto
 *
 * Representation of game state:
 * {
 *   board: [[int] * 4] * 4,
 *   current_player: int,
 *   pieces: [int],
 *   given_piece: int,
 *   winner: int
 * }
 * Each piece in the game is represented by a number 0-15, where each bit in
 * the number represents a property.
 * The board is a list of rows, which are each a list of cells.
 * Each cell is a number 0-15 corresponding to a piece, or -1 if it does not
 * contain a piece.
 * The winner is the player who has won the game, or -1 if game is in progress.
 * given_piece is the piece that to be played, or -1 if a piece must be chosen
 * by the current player to give to the other player.
 *
 * Piece bits <=> properties:
 * 0x8  Colour (Red, Blue)
 * 0x4  Shape (Circle, Square)
 * 0x2  Size (Small, Large)
 * 0x1  Fill (Solid, Hollow)
 *
 * Representation of game view:
 * {
 *   player: int,
 *   board: as above,
 *   current_player: as above,
 *   pieces: as above,
 *   given_piece: as above,
 *   winner: as above
 * }
 *
 * Representation of an action is either:
 * {
 *   type: "play",
 *   row: int,
 *   column: int
 * }
 * OR
 * {
 *   type: "give",
 *   given_piece: int
 * }
 */

function is_winning_set(pieces) {
  if (pieces.length !== 4) {
    return false;
  }
  let good = 0xf;
  for (let i = 0; i < pieces.length; i += 1) {
    if (pieces[i] < 0 || pieces[i] > 15) {
      return false;
    }
    if (i > 0) {
      good &= pieces[i] ^ pieces[i - 1] ^ 0xf;
    }
  }
  return good !== 0;
}

function contains_winning_set(board) {
  function get_set(start_r, start_c, dr, dc) {
    const result = [];
    let r = start_r;
    let c = start_c;
    while (r >= 0 && c >= 0 && r < 4 && c < 4) {
      result.push(board[r][c]);
      r += dr;
      c += dc;
    }
    return result;
  }

  for (let i = 0; i < 4; i += 1) {
    if (is_winning_set(get_set(i, 0, 0, 1))) return true;
    if (is_winning_set(get_set(0, i, 1, 0))) return true;
  }
  if (is_winning_set(get_set(0, 0, 1, 1))) return true;
  if (is_winning_set(get_set(0, 3, 1, -1))) return true;
  return false;
}

function initial_state(players) {
  const pieces = [];

  if (players !== 2) {
    throw 'Invalid number of players';
  }

  for (let i = 0; i < 16; i += 1) {
    pieces.push(i);
  }

  return {
    board: [[-1, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1],
            [-1, -1, -1, -1]],
    current_player: 0,
    pieces,
    given_piece: -1,
    winner: -1,
  };
}

function is_game_finished(game_state) {
  return game_state.winner !== -1 ||
      (game_state.pieces.length === 0 && game_state.given_piece === -1);
}

function winners(game_state) {
  if (game_state.winner !== -1) {
    return [game_state.winner];
  }
  return [];
}

function player_view(game_state, player) {
  return {
    player,
    board: JSON.parse(JSON.stringify(game_state.board)), // hacky but safe
    pieces: game_state.pieces.slice(),
    given_piece: game_state.given_piece,
    current_player: game_state.current_player,
    winner: game_state.winner,
  };
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

  // The view's player must be the current player.
  if (game_view.player !== game_view.current_player) {
    return false;
  }

  if (action.type === 'play') {
    // There must be a piece to play.
    if (game_view.given_piece === -1) {
      return false;
    }

    // The chosen tile must be empty.
    if (game_view.board[action.row][action.column] !== -1) {
      return false;
    }

    return true;
  } else if (action.type === 'give') {
    // There must be no piece already given.
    if (game_view.given_piece !== -1) {
      return false;
    }

    // The piece to give must not have been played already.
    if (game_view.pieces.indexOf(action.given_piece) === -1) {
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

  if (action.type === 'play') {
    // Place piece.
    game_copy.board[action.row][action.column] = game_copy.given_piece;
    game_copy.given_piece = -1;

    // Check if the current player just won.
    if (contains_winning_set(game_copy.board)) {
      game_copy.winner = game_copy.current_player;
    }
  } else { // action.type === 'give'
    // Remove the piece from pieces.
    const piece_index = game_copy.pieces.indexOf(action.given_piece);
    game_copy.pieces.splice(piece_index, 1);

    // Give the piece.
    game_copy.given_piece = action.given_piece;

    // Advance turn counter.
    game_copy.current_player = 1 - game_copy.current_player;
  }

  return game_copy;
}

export default {
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
