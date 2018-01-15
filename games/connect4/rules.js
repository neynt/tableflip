/* Rules for Connect 4
 *
 * Representation of game state:
 * {
 *   board: [[int] * 7] * 6,
 *   current_player: int,
 *   winner: int
 * }
 * The board is a list of rows of cells, and each cell in the board is the
 * player who played there, or -1 if the cell is empty.
 * The winner is the player who has won the game, or -1 if game is in progress.
 * Winner is cached in the state because checking for a winner is expensive
 * and knowing whether the game is over is required for move legality checks
 * which can happen often.
 *
 * Representation of game view:
 * {
 *   player: int,
 *   board: as above,
 *   current_player: as above,
 *   winner: as above
 * }
 *
 * Representation of action:
 * {
 *   column: int
 * }
 */

function winning_player(board) {
  const num_rows = board.length;
  const num_cols = board[0].length;

  function run_length(start_r, start_c, dr, dc) {
    // Return the number of consecutive equal elements in the board, starting at
    // (start_r, start_c) and stepping by (dr, dc).
    let result = 0;
    let r = start_r;
    let c = start_c;
    while (r >= 0 && c >= 0 && r < num_rows && c < num_cols) {
      if (board[r][c] === board[start_r][start_c]) result += 1;
      else break;
      r += dr;
      c += dc;
    }
    return result;
  }

  for (let r = 0; r < num_rows; r += 1) {
    for (let c = 0; c < num_cols; c += 1) {
      if (board[r][c] !== -1) {
        if (run_length(r, c, 0, 1) >= 4) return board[r][c];
        if (run_length(r, c, 1, 0) >= 4) return board[r][c];
        if (run_length(r, c, 1, 1) >= 4) return board[r][c];
        if (run_length(r, c, 1, -1) >= 4) return board[r][c];
      }
    }
  }
  return -1;
}

function initial_state(players) {
  if (players !== 2) {
    throw 'Invalid number of players';
  }

  return {
    board: [[-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1],
            [-1, -1, -1, -1, -1, -1, -1]],
    current_player: 0,
    winner: -1,
  };
}

function player_view(game_state, player) {
  return {
    player,
    board: JSON.parse(JSON.stringify(game_state.board)), // hacky but safe
    current_player: game_state.current_player,
    winner: game_state.winner,
  };
}

function current_players(game_state) {
  if (game_state.winner === -1) {
    return [game_state.current_player];
  }
  return [];
}

function has_legal_action(game_view) {
  return game_view.winner === -1 &&
         game_view.player === game_view.current_player;
}

function is_action_legal(game_view, action) {
  // Game must not be over.
  if (game_view.winner !== -1) {
    return false;
  }

  // The view's player must be the current player.
  if (game_view.player !== game_view.current_player) {
    return false;
  }

  // The column must be valid.
  if (action.column < 0 || action.column >= game_view.board[0].length) {
    return false;
  }

  // The column must not be full.
  return game_view.board[0][action.column] === -1;
}

function perform_action(old_game_state, player, action) {
  // Verify that the action is legal.
  if (!is_action_legal(player_view(old_game_state, player), action)) {
    throw 'Illegal action';
  }

  // Copy game state for safety.
  const game_state = JSON.parse(JSON.stringify(old_game_state));

  // Find last unoccupied row in the column.
  let row = 0;
  for (let r = 0; r < game_state.board.length; r += 1) {
    if (game_state.board[r][action.column] === -1) {
      row = r;
    } else {
      break;
    }
  }

  // Place piece.
  game_state.board[row][action.column] = player;

  // Determine if the player won. Could be optimized by only checking around
  // piece just placed.
  game_state.winner = winning_player(game_state.board);

  // Advance turn counter.
  game_state.current_player = 1 - game_state.current_player;

  return game_state;
}

function is_game_finished(game_state) {
  return game_state.winner !== -1;
}

function winners(game_state) {
  if (game_state.winner !== -1) {
    return [game_state.winner];
  }
  return [];
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
   * @param player ID of the player who is viewing the game, or -1 for observer.
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
   * @returns Array of player IDs. Empty if no player has won yet.
   */
  winners,
};
