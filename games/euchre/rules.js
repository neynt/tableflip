/* Rules for Euchre
 *
 * Representation of game state:
 * {
 *   plays: [card],
 *   hands: [[card]],
 *   tricks: [[[card]]],
 *   trump_card: card,
 *   trump: int,
 *   current_player: int,
 *   scores: [int, int],
 *   leader: int,
 *   dealer: int,
 *   bidder: int,
 *   alone: bool,
 *   stage: int
 * }
 * A card is an int, 0 <= card < 52, === suit * 13 + value - 1, or null.
 * Stage is one of:
 * 1 - Bidding
 * 2 - Proposing (trump card turned down)
 * 3 - Discarding (dealer picking up card)
 * 4 - Playing
 * Tricks from the previous hand are not cleared until the end of bidding,
 * so the UI can display the result of the last trick to users before
 * the next round begins.
 *
 * Representation of game view:
 * {
 *   player: int,
 *   plays: as above,
 *   hand: hands[player],
 *   tricks: as above,
 *   trump_card: as above,
 *   trump: as above,
 *   current_player: as above,
 *   leader: as above,
 *   scores: as above,
 *   dealer: as above,
 *   bidder: as above,
 *   alone: as above,
 *   stage: as above
 * }
 *
 * Representation of an action is either:
 * {
 *   type: "play",
 *   index: int
 * }
 * OR
 * {
 *   type: "pickup",
 *   index: int
 * }
 * OR
 * {
 *   type: "pass"
 * }
 * OR
 * {
 *   type: "bid",
 *   alone: bool
 * }
 * OR
 * {
 *   type: "propose",
 *   suit: int,
 *   alone: bool
 * }
 */

const STAGE = {
  BIDDING: 1,
  PROPOSING: 2,
  DISCARDING: 3,
  PLAYING: 4,
};

function make_card(suit, value) {
  return (suit * 13) + (value - 1);
}

function card_value(card) {
  return (card % 13) + 1;
}

function card_suit(card) {
  return Math.floor(card / 13);
}

function card_game_suit(card, trump) {
  const suit = card_suit(card);
  if (card_value(card) === 11 && (suit % 2 === trump % 2)) {
    return trump;
  }
  return suit;
}

function card_game_value(card, trump) {
  const suit = card_suit(card);
  const value = card_value(card);
  if (value === 11 && (suit % 2 === trump % 2)) {
    return suit === trump ? 16 : 15;
  } else if (value === 1) {
    return 14;
  }
  return value;
}

// Deals a hand of cards to each player and sets the trump card.
function deal_cards(game_state) {
  const game = game_state;
  const deck = [];
  for (let i = 0; i < 4; i += 1) {
    deck.push(make_card(i, 1));
    for (let j = 9; j <= 13; j += 1) {
      deck.push(make_card(i, j));
    }
  }
  for (let i = deck.length - 1; i > 1; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[j];
    deck[j] = deck[i];
    deck[i] = temp;
  }

  game.hands = [];
  for (let i = 0; i < 4; i += 1) {
    game.hands.push([]);
    for (let j = 0; j < 5; j += 1) {
      game.hands[i].push(deck.pop());
    }
  }
  game.trump_card = deck.pop();
}

function initial_state(players) {
  if (players !== 4) {
    throw 'Invalid number of players';
  }

  const state = {
    plays: [null, null, null, null],
    tricks: [[], [], [], []],
    trump: null,
    current_player: 1,
    scores: [0, 0],
    leader: null,
    dealer: 0,
    bidder: null,
    alone: false,
    stage: STAGE.BIDDING,
  };
  deal_cards(state);
  return state;
}

function player_view(game_state, player) {
  return {
    player,
    plays: game_state.plays,
    tricks: game_state.tricks,
    trump_card: game_state.trump_card,
    trump: game_state.trump,
    hand: player >= 0 && player < 4 ? game_state.hands[player] : [],
    current_player: game_state.current_player,
    scores: game_state.scores,
    leader: game_state.leader,
    dealer: game_state.dealer,
    bidder: game_state.bidder,
    alone: game_state.alone,
    stage: game_state.stage,
  };
}

function is_game_finished(game_state) {
  return game_state.scores[0] >= 10 || game_state.scores[1] >= 10;
}

function winners(game_state) {
  if (is_game_finished(game_state)) {
    return game_state.scores[0] >= 10 ? [0, 2] : [1, 3];
  }
  return [];
}

function current_players(game_state) {
  if (!is_game_finished(game_state)) {
    // TODO: Allow playing card in advance of turn.
    return [game_state.current_player];
  }
  return [];
}

function has_legal_action(game_view) {
  return !is_game_finished(game_view) &&
         game_view.player === game_view.current_player;
}

function can_follow_suit(hand, suit, trump) {
  for (let i = 0; i < hand.length; i += 1) {
    if (card_game_suit(hand[i], trump) === suit) {
      return true;
    }
  }
  return false;
}

function is_action_legal(game_view, action) {
  // Game must not be over.
  if (is_game_finished(game_view)) {
    // Calling is_game_finished on a game_view is not generally safe, but in
    // this game, game_view has the required properties.
    return false;
  }

  // The player must be the current player.
  if (game_view.player !== game_view.current_player) {
    return false;
  }

  if (action.type === 'play') {
    // Stage must be PLAYING.
    if (game_view.stage !== STAGE.PLAYING) {
      return false;
    }

    // Index must be within hand.
    if (action.index < 0 ||
        action.index >= game_view.hand.length) {
      return false;
    }

    const card_played = game_view.hand[action.index];

    // Must be leading, or following suit if able.
    if (game_view.leader !== game_view.player) {
      const led_suit = card_game_suit(game_view.plays[game_view.leader],
                                      game_view.trump);
      if (can_follow_suit(game_view.hand,
                          led_suit, game_view.trump) &&
          card_game_suit(card_played, game_view.trump) !== led_suit) {
        return false;
      }
    }

    return true;
  } else if (action.type === 'bid') {
    // Stage must be BIDDING.
    if (game_view.stage !== STAGE.BIDDING) {
      return false;
    }

    return true;
  } else if (action.type === 'pass') {
    // Stage must be BIDDING or PROPOSING.
    if (game_view.stage !== STAGE.BIDDING &&
        game_view.stage !== STAGE.PROPOSING) {
      return false;
    }

    return true;
  } else if (action.type === 'pickup') {
    // Stage must be DISCARDING.
    if (game_view.stage !== STAGE.DISCARDING) {
      return false;
    }

    // Index must be within hand.
    if (action.index < 0 ||
        action.index >= game_view.hand.length) {
      return false;
    }

    return true;
  } else if (action.type === 'propose') {
    // Stage must be PROPOSING.
    if (game_view.stage !== STAGE.PROPOSING) {
      return false;
    }

    // Suit must be valid suit, and not equal to turned-down suit.
    if (action.suit < 0 || action.suit > 3 ||
        action.suit === card_suit(game_view.trump_card)) {
      return false;
    }

    return true;
  }
  return false;
}

function next_player(game_state, player) {
  let next = (player + 1) % 4;
  // Handle playing alone.
  if (game_state.bidder === (next + 2) % 4 && game_state.alone) {
    next = (next + 1) % 4;
  }
  return next;
}

function trick_winner(trick, leader, trump) {
  let winner = leader;
  for (let i = 0; i < trick.length; i += 1) {
    const cur_suit = card_game_suit(trick[winner], trump);
    const cur_value = card_game_value(trick[winner], trump);
    const play_suit = card_game_suit(trick[i], trump);
    const play_value = card_game_value(trick[i], trump);
    if ((play_suit === trump && cur_suit !== trump) ||
        (play_suit === cur_suit && play_value > cur_value)) {
      winner = i;
    }
  }
  return winner;
}

function next_round(game_state) {
  const game = game_state;
  game.plays = [null, null, null, null];
  game.trump = null;
  game.dealer = (game.dealer + 1) % 4;
  game.current_player = (game.dealer + 1) % 4;
  game.leader = null;
  game.bidder = null;
  game.alone = false;
  game.stage = STAGE.BIDDING;
  deal_cards(game);
  return game;
}

function finish_round(game_state) {
  const game = game_state;
  const trick_counts = [0, 0];
  for (let i = 0; i < game.tricks.length; i += 1) {
    trick_counts[i % 2] += game.tricks[i].length;
  }
  const bid_team = game.bidder % 2;
  if (trick_counts[bid_team] === 5) {
    game.scores[bid_team] += game.alone ? 4 : 2;
  } else if (trick_counts[bid_team] >= 3) {
    game.scores[bid_team] += 1;
  } else {
    game.scores[1 - bid_team] += 2;
  }
  if (!is_game_finished(game)) {
    next_round(game);
  }
  return game;
}

function perform_action(game_state, player, action) {
  // Verify that the action is legal.
  if (!is_action_legal(player_view(game_state, player), action)) {
    throw 'Illegal action';
  }

  // Copy game state.
  const game_copy = JSON.parse(JSON.stringify(game_state));

  if (action.type === 'play') {
    const card = game_copy.hands[player].splice(action.index, 1)[0];
    game_copy.plays[player] = card;

    const next = next_player(game_copy, player);
    if (game_copy.plays[next] !== null) {
      // Hand complete, award trick to winner
      const winner = trick_winner(game_copy.plays, game_copy.leader,
                                  game_copy.trump);
      game_copy.tricks[winner].push(game_copy.plays);
      game_copy.plays = [null, null, null, null];
      game_copy.current_player = winner;
      game_copy.leader = winner;
      if (game_copy.hands[player].length === 0) {
        finish_round(game_copy);
      }
    } else {
      game_copy.current_player = next;
    }
  } else if (action.type === 'bid') {
    game_copy.trump = card_suit(game_copy.trump_card);
    game_copy.current_player = game_copy.dealer;
    game_copy.tricks = [[], [], [], []];
    game_copy.stage = STAGE.DISCARDING;
    game_copy.bidder = player;
    game_copy.alone = action.alone;
  } else if (action.type === 'pass') {
    game_copy.current_player = (game_copy.current_player + 1) % 4;
    if (player === game_copy.dealer) {
      if (game_copy.stage === STAGE.BIDDING) {
        game_copy.stage = STAGE.PROPOSING;
      } else {
        next_round(game_copy);
      }
    }
  } else if (action.type === 'pickup') {
    game_copy.hands[player].splice(action.index, 1, game_copy.trump_card);
    game_copy.stage = STAGE.PLAYING;
    game_copy.current_player = next_player(game_copy, game_copy.dealer);
    game_copy.leader = next_player(game_copy, game_copy.dealer);
  } else if (action.type === 'propose') {
    game_copy.trump = action.suit;
    game_copy.bidder = player;
    game_copy.alone = action.alone;
    game_copy.tricks = [[], [], [], []];
    game_copy.stage = STAGE.PLAYING;
    game_copy.current_player = next_player(game_copy, game_copy.dealer);
    game_copy.leader = next_player(game_copy, game_copy.dealer);
  }

  return game_copy;
}

export default {
  initial_state,
  player_view,
  current_players,
  has_legal_action,
  is_action_legal,
  perform_action,
  is_game_finished,
  winners,
};
