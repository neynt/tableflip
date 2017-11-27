import api from '@/api';

const polling = {};

export default {
  current_user: null,
  activeGames: null,
  userGames: null,
  lobbies: null,
  fetchActiveGames() {
    const that = this;
    api.get('games?finished=false&limit=100').then((data) => {
      that.activeGames = data;
    });
  },
  fetchUserGames() {
    const that = this;
    if (!this.current_user) {
      return;
    }
    api.get(`users/${this.current_user.id}/games`).then((data) => {
      that.userGames = data;
    });
  },
  fetchLobbies() {
    const that = this;
    api.get('lobbies').then((data) => {
      that.lobbies = data;
    });
  },
  poll(client, name, func) {
    if (!polling[name]) {
      polling[name] = {
        listeners: [],
        interval: null,
      };
    }
    if (!polling[name].interval) {
      polling[name].interval = setInterval(func, 1000);
      func();
    }
    if (polling[name].listeners.indexOf(client) === -1) {
      polling[name].listeners.push(client);
    }
  },
  stopPoll(client, name) {
    if (!polling[name]) {
      return;
    }
    const index = polling[name].listeners.indexOf(client);
    if (index !== -1) {
      polling[name].listeners.splice(index, 1);
    }
    if (polling[name].listeners.length === 0 && polling[name].interval) {
      clearInterval(polling[name].interval);
      polling[name].interval = null;
    }
  },
};
