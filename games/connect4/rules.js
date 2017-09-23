/* Rules for Connect 4
 *
 * Representation of game state:
 * {
 *   board: [[int] * 6] * 7,
 *   current_player: int,
 *   winner: int
 * }
 * The board is a list of columns from top to bottom, and each cell in the board
 * is the player who played there, or -1 if the cell is empty.
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
 *   player: int,
 *   column: int
 * }
 */

function winning_player(board) {
  // TODO: get rid of all the magic numbers in this function.

  // Vertical and diagonal.
  for (var i = -2; i < board.length; i++) {
    var run_length = 0;
    var run_player = 0;
    var slash_run_length = 0;
    var slash_run_player = 0;
    var backslash_run_length = 0;
    var backslash_run_player = 0;
    var forward_run_player = 0;

    for (var j = 0; j < 6; j++) {
      // Vertical.
      if (i >= 0 && i < board.length) {
        if (board[i][j] !== run_player) {
          run_player = board[i][j];
          run_length = 1;
        } else {
          run_length++;
          if (run_length >= 4 && run_player !== -1) {
            return run_player;
          }
        }
      }

      if (i + j >= 0 && i + j < board.length) {
        // Slash diagonal (/).
        if (board[i + j][5 - j] !== slash_run_player) {
          slash_run_player = board[i + j][5 - j];
          slash_run_length = 1;
        } else {
          slash_run_length++;
          if (slash_run_length >= 4 && slash_run_player !== -1) {
            return slash_run_player;
          }
        }

        // Backslash diagonal (\).
        if (board[i + j][j] !== backslash_run_player) {
          backslash_run_player = board[i + j][j];
          backslash_run_length = 1;
        } else {
          backslash_run_length++;
          if (backslash_run_length >= 4 && backslash_run_player !== -1) {
            return backslash_run_player;
          }
        }
      }
    }
  }

  // Horizontal.
  for (var j = 0; j < board[0].length; j++) {
    var run_length = 0;
    var run_player = -1;
    for (var i = 0; i < board.length; i++) {
      if (board[i][j] !== run_player) {
        run_player = board[i][j];
        run_length = 1;
      } else {
        run_length++;
        if (run_length >= 4 && run_player !== -1) {
          return run_player;
        }
      }
    }
  }

  return -1;
}

function initial_state(players) {
  if (players !== 2) {
    throw "Invalid number of players";
  }

  return {
    board: [[-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1]],
    current_player: 0,
    winner: -1
  };
}

function player_view(game_state, player) {
  return {
    player: player,
    board: JSON.parse(JSON.stringify(game_state.board)), // hacky but safe
    current_player: game_state.current_player,
    winner: game_state.winner
  };
}

function current_players(game_state) {
  if (game_state.winner === -1) {
    return [game_state.current_player];
  } else {
    return [];
  }
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

  // The action's player must be the current player.
  if (action.player !== game_view.current_player) {
    return false;
  }

  // The column must be valid.
  if (action.column < 0 || action.column >= game_view.board.length) {
    return false;
  }

  // The column must not be full.
  return game_view.board[action.column][0] === -1;
}

function perform_action(game_state, player, action) {
  // Verify that the action is legal.
  if (!is_action_legal(player_view(game_state, player), action)) {
    throw "Illegal action";
  }

  // Copy game state for safety.
  game_state = JSON.parse(JSON.stringify(game_state));

  // Find last unoccupied row in the column.
  var row = 0;
  for (var i = 0; i < game_state.board[action.column].length; i++) {
    if (game_state.board[action.column][i] === -1) {
      row = i;
    } else {
      break;
    }
  }

  // Place piece.
  game_state.board[action.column][row] = action.player;

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
  } else {
    return [];
  }
}

module.exports = game = {
  /* Creates initial game state.
   * @param players Number of players in the game.
   * @throws something if the game does not support that number of players.
   * @returns Object representating initial game state.
   */
  initial_state: initial_state,

  /* Gets a view of the game state for given player.
   * @param game_state Game state.
   * @param player ID of the player who is viewing the game.
   * @returns Object representating portion of game state visible to the player.
   */
  player_view: player_view,

  /* Gets a list of players who may make actions at the current time.
   * @param game_state Game state.
   * @returns Array of player IDs.
   */
  current_players: current_players,

  /* Determines whether the current player can make any actions.
   * Similar to current_players, but only requires a view; in general, a player
   * may not be allowed to know which other players may currently make actions.
   * @param game_view View of the game for the player.
   * @returns boolean, whether or not the player may make an action.
   */
  has_legal_action: has_legal_action,

  /* Determines whether an action is currently legal.
   * @param game_view View of the game for the player making the action.
   * @param action Object representing action.
   * @returns boolean, whether or not action is legal.
   */
  is_action_legal: is_action_legal,

  /* Applies an action to a game state to produce a new game state.
   * @param game_state Game state.
   * @param player ID of the player making the action.
   * @param action Object representating action.
   * @throws something if the action is not legal.
   * @returns Object representing new state of the game.
   */
  perform_action: perform_action,

  /* Determines whether the game is finished.
   * @param game_state Game state.
   * @returns boolean, whether the game is over or not.
   */
  is_game_finished: is_game_finished,

  /* Gets a list of winning players.
   * @param game_state Game state.
   * @returns Arry of player IDs. Empty if no player has won yet.
   */
  winners: winners
};
