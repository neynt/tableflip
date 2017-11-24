import games from './nodeindex';

export default {
  connect4: {
    name: games.connect4.name,
    min_players: games.connect4.min_players,
    max_players: games.connect4.max_players,
    view: () => import('./connect4/View'),
    rules: () => import('./connect4/rules'),
  },
  quarto: {
    name: games.quarto.name,
    min_players: games.quarto.min_players,
    max_players: games.quarto.max_players,
    view: () => import('./quarto/View'),
    rules: () => import('./quarto/rules'),
  },
  hanabi: {
    name: games.hanabi.name,
    min_players: games.hanabi.min_players,
    max_players: games.hanabi.max_players,
    view: () => import('./hanabi/View'),
    rules: () => import('./hanabi/rules'),
  },
  loveletter: {
    name: games.loveletter.name,
    min_players: games.loveletter.min_players,
    max_players: games.loveletter.max_players,
    view: () => import('./loveletter/View'),
    rules: () => import('./loveletter/rules'),
  },
  euchre: {
    name: games.euchre.name,
    min_players: games.euchre.min_players,
    max_players: games.euchre.max_players,
    view: () => import('./euchre/View'),
    rules: () => import('./euchre/rules'),
  },
  homeworlds: {
    name: games.homeworlds.name,
    min_players: games.homeworlds.min_players,
    max_players: games.homeworlds.max_players,
    view: () => import('./homeworlds/View'),
    rules: () => import('./homeworlds/rules'),
  },
};
