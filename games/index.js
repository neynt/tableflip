export default {
  connect4: {
    name: 'Connect 4',
    view: () => import('./connect4/View'),
    rules: () => import('./connect4/rules'),
    min_players: 2,
    max_players: 2,
  },
  quarto: {
    name: 'Quarto',
    view: () => import('./quarto/View'),
    rules: () => import('./quarto/rules'),
    min_players: 2,
    max_players: 2,
  },
  hanabi: {
    name: 'Hanabi',
    view: () => import('./hanabi/View'),
    rules: () => import('./hanabi/rules'),
    min_players: 2,
    max_players: 5,
  },
  loveletter: {
    name: 'Love Letter',
    view: () => import('./loveletter/View'),
    rules: () => import('./loveletter/rules'),
    min_players: 2,
    max_players: 5,
  },
};
