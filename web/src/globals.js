import api from '@/api';

export default {
  current_user: null,
  games: null,
  lobbies: null,
  fetchGames() {
    const that = this;
    api.get(`users/${this.current_user.id}/games`).then((data) => {
      that.games = data;
    });
  },
  fetchLobbies() {
    const that = this;
    api.get('lobbies').then((data) => {
      that.lobbies = data;
    });
  },
};
