/* Rules for 7 Wonders: Duel
 *
 * Game state:
 * {
 *   current: int,
 *   age: int, // 1 to 3
 *   tree: [[card]],
 *   city: [[card]],
 *   coins: [int],
 *   discard: [card],
 *   wonders: [[wonder]],
 *   unbuilt_wonders: [[wonder]],
 *   progress: [[progress]],
 *   unbuilt_progress: [progress],
 *   military: int, // -9 to 9, positive towards player 1
 *   military_tokens: [bool], // four, (-8, -6), (-5, -3), (3, 5), (6, 8)
 *   // Below are params for special situations, unset normally
 *   wonders_draft: [wonder],
 *   library: [progress],
 *   mausoleum: true, // select a discarded card
 *   destroy_resource: colour, // select card of that colour to destroy
 *   first_turn: true, // first turn of age, player can pass if they want
 * }
 *
 * View is same as state, but odd rows in tree are hidden if the card is not accessible
 * card is int, wonder is int, progress is int, colour is int
 * cards start at 1, because 0 is empty card in tree
 * everything else starts at 1 for consistency
 * colour: {1: brown, 2: grey, 3: red, 4: green, 5: yellow, 6: blue, 7: purple }
 *
 * {
 *   type: "construct" | "discard" | "wonder",
 *   row: int, col: int, // in tree
 *   wonder: wonder, // for type: "wonder" only
 * }
 * {
 *   type: "pass" // first turn of age
 * }
 * {
 *   type: "draft_wonder",
 *   wonder: wonder,
 * }
 * {
 *   type: "select_progress",
 *   progress: progress,
 * }
 * {
 *   type: "destroy",
 *   card: card,
 * }
 * {
 *   type: "resurrect",
 *   card: card,
 * }
 */

let CARDS = {}; // Predeclare

function count_coloured_buildings(state, player, colour) {
  let count = 0;
  for (let i = 0; i < state.city[player].length; i += 1) {
    const card = CARDS[state.city[player][i]];
    if (card.colour === colour) {
      count += 1;
    }
  }
  return count;
}

function count_coloured_buildings_fn(colour, multiplier) {
  function inner(state, player) {
    return count_coloured_buildings(state, player, colour) * multiplier;
  }
  return inner;
}

function count_wonders_fn(multiplier) {
  function inner(state, player) {
    return state.wonders[player].length * multiplier;
  }
  return inner;
}

// Takes a function and turns it into a guild function (look at both players)
function guild_fn(fn) {
  function inner(state, player) {
    return Math.max(fn(state, player), fn(state, 1 - player));
  }
  return inner;
}

const shipowners_fn = guild_fn((state, player) =>
  count_coloured_buildings(state, player, 1) + count_coloured_buildings(state, player, 2),
);

const CHAINS = {
  horseshoe: 1,
  sword: 2,
  castle: 3,
  target: 4,
  helmet: 5,
  book: 6,
  gear: 7,
  lyre: 8,
  lamp: 9,
  mask: 10,
  pillar: 11,
  moon: 12,
  sun: 13,
  water: 14,
  senate: 15,
  urn: 16,
  barrel: 17,
};

CARDS = {
  // AGE I
  1: {
    name: 'Lumber Yard',
    colour: 1,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 1 }],
  },
  2: {
    name: 'Logging Camp',
    colour: 1,
    cost: [1, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 1 }],
  },
  3: {
    name: 'Clay Pool',
    colour: 1,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 2 }],
  },
  4: {
    name: 'Clay Pit',
    colour: 1,
    cost: [1, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 2 }],
  },
  5: {
    name: 'Quarry',
    colour: 1,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 3 }],
  },
  6: {
    name: 'Stone Pit',
    colour: 1,
    cost: [1, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 3 }],
  },
  7: {
    name: 'Glassworks',
    colour: 2,
    cost: [1, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 4 }],
  },
  8: {
    name: 'Press',
    colour: 2,
    cost: [1, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 5 }],
  },
  9: {
    name: 'Guard Tower',
    colour: 3,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'shields', amt: 1 }],
  },
  10: {
    name: 'Stable',
    colour: 3,
    cost: [0, 1, 0, 0, 0, 0],
    chain: CHAINS.horseshoe,
    effects: [{ type: 'shields', amt: 1 }],
  },
  11: {
    name: 'Garrison',
    colour: 3,
    cost: [0, 0, 1, 0, 0, 0],
    chain: CHAINS.sword,
    effects: [{ type: 'shields', amt: 1 }],
  },
  12: {
    name: 'Pallisade',
    colour: 3,
    cost: [2, 0, 0, 0, 0, 0],
    chain: CHAINS.castle,
    effects: [{ type: 'shields', amt: 1 }],
  },
  13: {
    name: 'Workshop',
    colour: 4,
    cost: [0, 0, 0, 0, 0, 1],
    effects: [{ type: 'science', science: 1 }, { type: 'victory', amt: 1 }],
  },
  14: {
    name: 'Apothecary',
    colour: 4,
    cost: [0, 0, 0, 0, 1, 0],
    effects: [{ type: 'science', science: 2 }, { type: 'victory', amt: 1 }],
  },
  15: {
    name: 'Scriptorium',
    colour: 4,
    cost: [2, 0, 0, 0, 0, 0],
    chain: CHAINS.book,
    effects: [{ type: 'science', science: 3 }],
  },
  16: {
    name: 'Pharmacist',
    colour: 4,
    cost: [2, 0, 0, 0, 0, 0],
    chain: CHAINS.gear,
    effects: [{ type: 'science', science: 4 }],
  },
  17: {
    name: 'Stone Reserve',
    colour: 5,
    cost: [3, 0, 0, 0, 0, 0],
    effects: [{ type: 'trade', r: 3 }],
  },
  18: {
    name: 'Clay Reserve',
    colour: 5,
    cost: [3, 0, 0, 0, 0, 0],
    effects: [{ type: 'trade', r: 2 }],
  },
  19: {
    name: 'Wood Reserve',
    colour: 5,
    cost: [3, 0, 0, 0, 0, 0],
    effects: [{ type: 'trade', r: 1 }],
  },
  20: {
    name: 'Tavern',
    colour: 5,
    cost: [0, 0, 0, 0, 0, 0],
    chain: CHAINS.urn,
    effects: [{ type: 'coins', amt: 4 }],
  },
  21: {
    name: 'Theater',
    colour: 6,
    cost: [0, 0, 0, 0, 0, 0],
    chain: CHAINS.mask,
    effects: [{ type: 'victory', amt: 3 }],
  },
  22: {
    name: 'Altar',
    colour: 6,
    cost: [0, 0, 0, 0, 0, 0],
    chain: CHAINS.moon,
    effects: [{ type: 'victory', amt: 3 }],
  },
  23: {
    name: 'Baths',
    colour: 6,
    cost: [0, 0, 0, 1, 0, 0],
    chain: CHAINS.water,
    effects: [{ type: 'victory', amt: 3 }],
  },
  // AGE II
  24: {
    name: 'Sawmill',
    colour: 1,
    cost: [2, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 1 }, { type: 'resource', r: 1 }],
  },
  25: {
    name: 'Brickyard',
    colour: 1,
    cost: [2, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 2 }, { type: 'resource', r: 2 }],
  },
  26: {
    name: 'Shelf Quarry',
    colour: 1,
    cost: [2, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 3 }, { type: 'resource', r: 3 }],
  },
  27: {
    name: 'Glass-blower',
    colour: 2,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 4 }],
  },
  28: {
    name: 'Drying Room',
    colour: 2,
    cost: [0, 0, 0, 0, 0, 0],
    effects: [{ type: 'resource', r: 5 }],
  },
  29: {
    name: 'Walls',
    colour: 3,
    cost: [0, 0, 0, 2, 0, 0],
    effects: [{ type: 'shields', amt: 2 }],
  },
  30: {
    name: 'Horse Breeders',
    colour: 3,
    cost: [0, 1, 1, 0, 0, 0],
    chain_cost: CHAINS.horseshoe,
    effects: [{ type: 'shields', amt: 1 }],
  },
  31: {
    name: 'Barracks',
    colour: 3,
    cost: [3, 0, 0, 0, 0, 0],
    chain_cost: CHAINS.sword,
    effects: [{ type: 'shields', amt: 1 }],
  },
  32: {
    name: 'Archery Range',
    colour: 3,
    cost: [0, 1, 0, 1, 0, 1],
    chain: CHAINS.target,
    effects: [{ type: 'shields', amt: 2 }],
  },
  33: {
    name: 'Parade Ground',
    colour: 3,
    cost: [0, 0, 2, 0, 1, 0],
    chain: CHAINS.helmet,
    effects: [{ type: 'shields', amt: 2 }],
  },
  34: {
    name: 'Library',
    colour: 4,
    cost: [0, 1, 0, 1, 1, 0],
    chain_cost: CHAINS.book,
    effects: [{ type: 'science', science: 3 }, { type: 'victory', amt: 2 }],
  },
  35: {
    name: 'Dispensary',
    colour: 4,
    cost: [0, 0, 2, 1, 0, 0],
    chain_cost: CHAINS.gear,
    effects: [{ type: 'science', science: 4 }, { type: 'victory', amt: 2 }],
  },
  36: {
    name: 'School',
    colour: 4,
    cost: [0, 1, 0, 0, 0, 2],
    chain: CHAINS.lyre,
    effects: [{ type: 'science', science: 2 }, { type: 'victory', amt: 1 }],
  },
  37: {
    name: 'Laboratory',
    colour: 4,
    cost: [0, 1, 0, 0, 2, 0],
    chain: CHAINS.lamp,
    effects: [{ type: 'science', science: 1 }, { type: 'victory', amt: 1 }],
  },
  38: {
    name: 'Forum',
    colour: 5,
    cost: [3, 0, 1, 0, 0, 0],
    effects: [{ type: 'resource_opt', rs: [4, 5] }],
  },
  39: {
    name: 'Caravansery',
    colour: 5,
    cost: [2, 0, 0, 0, 1, 1],
    effects: [{ type: 'resource_opt', rs: [1, 2, 3] }],
  },
  40: {
    name: 'Customs House',
    colour: 5,
    cost: [4, 0, 0, 0, 0, 0],
    effects: [{ type: 'trade', r: 4 }, { type: 'trade', r: 5 }],
  },
  41: {
    name: 'Brewery',
    colour: 5,
    cost: [0, 0, 0, 0, 0, 0],
    chain: CHAINS.barrel,
    effects: [{ type: 'coins', amt: 6 }],
  },
  42: {
    name: 'Courthouse',
    colour: 6,
    cost: [0, 2, 0, 0, 1, 0],
    effects: [{ type: 'victory', amt: 5 }],
  },
  43: {
    name: 'Statue',
    colour: 6,
    cost: [0, 0, 2, 0, 0, 0],
    chain_cost: CHAINS.mask,
    chain: CHAINS.pillar,
    effects: [{ type: 'victory', amt: 4 }],
  },
  44: {
    name: 'Temple',
    colour: 6,
    cost: [0, 1, 0, 0, 0, 1],
    chain_cost: CHAINS.moon,
    chain: CHAINS.sun,
    effects: [{ type: 'victory', amt: 4 }],
  },
  45: {
    name: 'Aqueduct',
    colour: 6,
    cost: [0, 0, 0, 3, 0, 0],
    chain_cost: CHAINS.water,
    effects: [{ type: 'victory', amt: 5 }],
  },
  46: {
    name: 'Rostrum',
    colour: 6,
    cost: [0, 1, 0, 1, 0, 0],
    chain: CHAINS.senate,
    effects: [{ type: 'victory', amt: 4 }],
  },
  // AGE III
  47: {
    name: 'Arsenal',
    colour: 3,
    cost: [0, 2, 3, 0, 0, 0],
    effects: [{ type: 'shields', amt: 3 }],
  },
  48: {
    name: 'Pretorium',
    colour: 3,
    cost: [8, 0, 0, 0, 0, 0],
    effects: [{ type: 'shields', amt: 3 }],
  },
  49: {
    name: 'Fortifications',
    colour: 3,
    cost: [0, 0, 1, 2, 0, 1],
    chain_cost: CHAINS.castle,
    effects: [{ type: 'shields', amt: 2 }],
  },
  50: {
    name: 'Siege Workshop',
    colour: 3,
    cost: [0, 3, 0, 0, 1, 0],
    chain_cost: CHAINS.target,
    effects: [{ type: 'shields', amt: 2 }],
  },
  51: {
    name: 'Circus',
    colour: 3,
    cost: [0, 0, 2, 2, 0, 0],
    chain_cost: CHAINS.helmet,
    effects: [{ type: 'shields', amt: 2 }],
  },
  52: {
    name: 'Academy',
    colour: 4,
    cost: [0, 1, 0, 1, 2, 0],
    effects: [{ type: 'science', science: 5 }, { type: 'victory', amt: 3 }],
  },
  53: {
    name: 'Study',
    colour: 4,
    cost: [0, 2, 0, 0, 1, 1],
    effects: [{ type: 'science', science: 5 }, { type: 'victory', amt: 3 }],
  },
  54: {
    name: 'University',
    colour: 4,
    cost: [0, 0, 1, 0, 1, 1],
    chain_cost: CHAINS.lyre,
    effects: [{ type: 'science', science: 6 }, { type: 'victory', amt: 2 }],
  },
  55: {
    name: 'Observatory',
    colour: 4,
    cost: [0, 0, 0, 1, 0, 2],
    chain_cost: CHAINS.lamp,
    effects: [{ type: 'science', science: 6 }, { type: 'victory', amt: 2 }],
  },
  56: {
    name: 'Chamber of Commerce',
    colour: 5,
    cost: [0, 0, 0, 0, 0, 2],
    effects: [{ type: 'coins_fn', fn: count_coloured_buildings_fn(2, 3) },
              { type: 'victory', amt: 3 }],
  },
  57: {
    name: 'Port',
    colour: 5,
    cost: [0, 1, 0, 0, 1, 1],
    effects: [{ type: 'coins_fn', fn: count_coloured_buildings_fn(1, 2) },
              { type: 'victory', amt: 3 }],
  },
  58: {
    name: 'Armory',
    colour: 5,
    cost: [0, 0, 0, 2, 1, 0],
    effects: [{ type: 'coins_fn', fn: count_coloured_buildings_fn(3, 1) },
              { type: 'victory', amt: 3 }],
  },
  59: {
    name: 'Lighthouse',
    colour: 5,
    cost: [0, 0, 2, 0, 1, 0],
    chain_cost: CHAINS.urn,
    effects: [{ type: 'coins_fn', fn: count_coloured_buildings_fn(5, 1) },
              { type: 'victory', amt: 3 }],
  },
  60: {
    name: 'Arena',
    colour: 5,
    cost: [0, 1, 1, 1, 0, 0],
    chain_cost: CHAINS.barrel,
    effects: [{ type: 'coins_fn', fn: count_wonders_fn(2) },
              { type: 'victory', amt: 3 }],
  },
  61: {
    name: 'Palace',
    colour: 6,
    cost: [0, 1, 1, 1, 2, 0],
    effects: [{ type: 'victory', amt: 7 }],
  },
  62: {
    name: 'Town Hall',
    colour: 6,
    cost: [0, 2, 0, 3, 0, 0],
    effects: [{ type: 'victory', amt: 7 }],
  },
  63: {
    name: 'Obelisk',
    colour: 6,
    cost: [0, 0, 0, 2, 1, 0],
    effects: [{ type: 'victory', amt: 5 }],
  },
  64: {
    name: 'Gardens',
    colour: 6,
    cost: [0, 2, 2, 0, 0, 0],
    chain_cost: CHAINS.pillar,
    effects: [{ type: 'victory', amt: 6 }],
  },
  65: {
    name: 'Pantheon',
    colour: 6,
    cost: [0, 1, 1, 0, 0, 2],
    chain_cost: CHAINS.sun,
    effects: [{ type: 'victory', amt: 6 }],
  },
  66: {
    name: 'Senate',
    colour: 6,
    cost: [0, 0, 2, 1, 0, 1],
    chain_cost: CHAINS.senate,
    effects: [{ type: 'victory', amt: 5 }],
  },
  67: {
    name: 'Merchants Guild',
    colour: 7,
    cost: [0, 1, 1, 0, 1, 1],
    effects: [{ type: 'coins_fn', fn: guild_fn(count_coloured_buildings_fn(5, 1)) },
              { type: 'victory_fn', fn: guild_fn(count_coloured_buildings_fn(5, 1)) }],
  },
  68: {
    name: 'Shipowners Guild',
    colour: 7,
    cost: [0, 1, 0, 1, 1, 1],
    effects: [{ type: 'coins_fn', fn: shipowners_fn },
              { type: 'victory_fn', fn: shipowners_fn }],
  },
  69: {
    name: 'Builders Guild',
    colour: 7,
    cost: [0, 1, 1, 2, 1, 0],
    effects: [{ type: 'victory_fn', fn: guild_fn(count_wonders_fn(2)) }],
  },
  70: {
    name: 'Magistrates Guild',
    colour: 7,
    cost: [0, 2, 1, 0, 0, 1],
    effects: [{ type: 'coins_fn', fn: guild_fn(count_coloured_buildings_fn(6, 1)) },
              { type: 'victory_fn', fn: guild_fn(count_coloured_buildings_fn(6, 1)) }],
  },
  71: {
    name: 'Scientists Guild',
    colour: 7,
    cost: [0, 2, 2, 0, 0, 0],
    effects: [{ type: 'coins_fn', fn: guild_fn(count_coloured_buildings_fn(4, 1)) },
              { type: 'victory_fn', fn: guild_fn(count_coloured_buildings_fn(4, 1)) }],
  },
  72: {
    name: 'Moneylenders Guild',
    colour: 7,
    cost: [0, 2, 0, 2, 0, 0],
    effects: [{ type: 'victory_fn',
               fn: guild_fn((state, player) => Math.floor(state.coins[player] / 3)) }],
  },
  73: {
    name: 'Tacticians Guild',
    colour: 7,
    cost: [0, 0, 1, 2, 0, 1],
    effects: [{ type: 'coins_fn', fn: guild_fn(count_coloured_buildings_fn(3, 1)) },
              { type: 'victory_fn', fn: guild_fn(count_coloured_buildings_fn(3, 1)) }],
  },
};

const WONDERS = {
  1: {
    name: 'The Appian Way',
    cost: [0, 0, 2, 2, 0, 1],
    effects: [{ type: 'coins', amt: 3 }, { type: 'take_coins', amt: 3 },
              { type: 'goagain' }, { type: 'victory', amt: 3 }],
  },
  2: {
    name: 'Circus Maximus',
    cost: [0, 1, 0, 2, 1, 0],
    effects: [{ type: 'destory_resource', colour: 2 }, { type: 'shields', amt: 1 },
              { type: 'victory', amt: 3 }],
  },
  3: {
    name: 'The Collosus',
    cost: [0, 0, 3, 0, 1, 0],
    effects: [{ type: 'shields', amt: 2 }, { type: 'victory', amt: 3 }],
  },
  4: {
    name: 'The Great Library',
    cost: [0, 3, 0, 0, 1, 1],
    effects: [{ type: 'library' }, { type: 'victory', amt: 4 }],
  },
  5: {
    name: 'The Great Lighthouse',
    cost: [0, 1, 0, 1, 0, 2],
    effects: [{ type: 'resource_opt', rs: [1, 2, 3] }, { type: 'victory', amt: 4 }],
  },
  6: {
    name: 'The Hanging Gardens',
    cost: [0, 2, 0, 0, 1, 1],
    effects: [{ type: 'coins', amt: 6 }, { type: 'goagain' }, { type: 'victory', amt: 3 }],
  },
  7: {
    name: 'The Mausoleum',
    cost: [0, 2, 0, 0, 2, 1],
    effects: [{ type: 'mausoleum' }, { type: 'victory', amt: 2 }],
  },
  8: {
    name: 'Piraeus',
    cost: [0, 2, 1, 1, 0, 0],
    effects: [{ type: 'resource_opt', rs: [4, 5] }, { type: 'goagain' },
              { type: 'victory', amt: 2 }],
  },
  9: {
    name: 'The Pyramids',
    cost: [0, 0, 0, 3, 0, 1],
    effects: [{ type: 'victory', amt: 9 }],
  },
  10: {
    name: 'The Sphinx',
    cost: [0, 0, 1, 1, 2, 0],
    effects: [{ type: 'goagain' }, { type: 'victory', amt: 6 }],
  },
  11: {
    name: 'The Statue of Zeus',
    cost: [0, 1, 1, 1, 0, 2],
    effects: [{ type: 'destroy_resource', colour: 1 }, { type: 'shields', amt: 1 },
              { type: 'victory', amt: 3 }],
  },
  12: {
    name: 'The Temple of Anubis',
    cost: [0, 1, 0, 1, 1, 1],
    effects: [{ type: 'coins', amt: 12 }, { type: 'goagain' }],
  },
};

const PROGRESS = {
  1: {
    name: 'Agriculture',
    effects: [{ type: 'coins', amt: 6 }, { type: 'victory', amt: 4 }],
  },
  2: {
    name: 'Architecture',
    effects: [{ type: 'architecture' }],
  },
  3: {
    name: 'Economy',
    effects: [{ type: 'economy' }],
  },
  4: {
    name: 'Law',
    effects: [{ type: 'science', science: 7 }],
  },
  5: {
    name: 'Masonry',
    effects: [{ type: 'masonry' }],
  },
  6: {
    name: 'Mathematics',
    effects: [{ type: 'victory_fn',
               fn: (state, player) => state.progress[player].length * 3 }],
  },
  7: {
    name: 'Philosophy',
    effects: [{ type: 'victory', amt: 7 }],
  },
  8: {
    name: 'Strategy',
    effects: [{ type: 'strategy' }],
  },
  9: {
    name: 'Theology',
    effects: [{ type: 'theology' }],
  },
  10: {
    name: 'Urbanism',
    effects: [{ type: 'coins', amt: 6 }, { type: 'urbanism' }],
  },
};

// Progress tokens that are still in the box
function remaining_progress(state) {
  const r = [];
  for (let i = 1; i <= 10; i += 1) {
    if (state.progress.every(p => !p.includes(i)) && !state.unbuilt_progress.includes(i)) {
      r.push(i);
    }
  }
  return r;
}

// Wonders that are still in the box
function remaining_wonders(state) {
  const r = [];
  for (let i = 1; i <= 12; i += 1) {
    if (state.wonders.every(w => !w.includes(i)) &&
        state.unbuilt_wonders.every(w => !w.includes(i))) {
      r.push(i);
    }
  }
  return r;
}

function shuffle(list) {
  const l = list.slice();
  for (let i = 0; i < l.length; i += 1) {
    const j = Math.floor(Math.random() * (l.length - i)) + i;
    const temp = l[i];
    l[i] = l[j];
    l[j] = temp;
  }
  return l;
}

function available(tree, row, col) {
  if (row + 1 >= tree.length) return true;
  return col % 2 === 0;
}

function initial_state(players) {
  if (players !== 2) {
    throw 'Invalid number of players';
  }
  const state = {
    current: 0,
    age: null,
    tree: [],
    city: [[], []],
    coins: [7, 7],
    discard: [],
    wonders: [[], []],
    unbuilt_wonders: [[], []],
    progress: [[], []],
    unbuilt_progress: [],
    military: 0,
    military_tokens: [true, true, true, true],
  };
  // Select progress tokens
  const progress = shuffle(remaining_progress(state));
  state.unbuilt_progress = progress.slice(0, 5);
  // Select wonders for draft
  const wonders = shuffle(remaining_wonders(state));
  state.wonders_draft = wonders.slice(0, 4);
  return state;
}

function player_view(state, player) {
  const view = JSON.parse(JSON.stringify(state));
  view.player = player;
  for (let row = 1; row < view.tree.length; row += 1) {
    for (let col = 0; col < view.tree[row].length; col += 1) {
      if (view.tree[row][col] !== 0 && !available(view.tree, row, col)) {
        view.tree[row][col] = -1;
      }
    }
  }
  return view;
}

function science_count(state, player) {
  const distinct = [];
  function add_science(effect) {
    if (effect.science !== undefined && !distinct.includes(effect.science)) {
      distinct.push(effect.science);
    }
  }
  for (let i = 0; i < state.city[player].length; i += 1) {
    const card = CARDS[state.city[player][i]];
    card.effects.forEach(add_science);
  }
  for (let i = 0; i < state.progress[player].length; i += 1) {
    const progress = PROGRESS[state.progress[player][i]];
    progress.effects.forEach(add_science);
  }
  return distinct.length;
}

function victory_count(state, player) {
  let total = 0;
  function add_victory(effect) {
    if (effect.type === 'victory') {
      total += effect.amt;
    } else if (effect.type === 'victory_fn') {
      total += effect.fn(state, player);
    }
  }
  for (let i = 0; i < state.city[player].length; i += 1) {
    const card = CARDS[state.city[player][i]];
    card.effects.forEach(add_victory);
  }
  for (let i = 0; i < state.wonders[player].length; i += 1) {
    const wonder = WONDERS[state.wonders[player][i]];
    wonder.effects.forEach(add_victory);
  }
  for (let i = 0; i < state.progress[player].length; i += 1) {
    const progress = PROGRESS[state.progress[player][i]];
    progress.effects.forEach(add_victory);
  }
  return total;
}

function is_game_finished(state) {
  return Math.abs(state.military) >= 9
      || science_count(state, 0) >= 6
      || science_count(state, 1) >= 6
      || (state.age === 3 && state.tree[0].every(x => x === 0));
}

function winners(state) {
  if (!is_game_finished(state)) {
    return [];
  }
  if (Math.abs(state.military) >= 9) {
    return [state.military > 0 ? 0 : 1];
  }
  if (science_count(state, 0) >= 6) {
    return [0];
  }
  if (science_count(state, 0) >= 6) {
    return [1];
  }
  const victory = [victory_count(state, 0), victory_count(state, 1)];
  if (victory[0] > victory[1]) return [0];
  if (victory[0] < victory[1]) return [1];
  return [0, 1]; // Tie!
}

function current_players(state) {
  if (!is_game_finished(state)) {
    return [state.current];
  }
  return [];
}

function has_legal_action(view) {
  return !is_game_finished(view) && view.player === view.current;
}

module.exports = {
  initial_state,
  player_view,
  current_players,
  has_legal_action,
//  is_action_legal,
//  perform_action,
  is_game_finished,
  winners,
  // Game-specific extra exports
  cards: CARDS,
  wonders: WONDERS,
  progress: PROGRESS,
};
