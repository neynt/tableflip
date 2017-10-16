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
    name: 'Love Letter',
    view: () => import('./loveletter/View'),
    rules: () => import('./loveletter/rules'),
    min_players: 2,
    max_players: 5,
  },
};
