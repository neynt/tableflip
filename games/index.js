export default {
  connect4: {
    name: 'Connect 4',
    view: () => import('./connect4/View'),
    rules: () => import('./connect4/rules'),
    min_players: 2,
    max_players: 2,
  },
};
