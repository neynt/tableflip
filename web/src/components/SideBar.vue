<template lang='pug'>
  div
    h1
      span.accent(style='font-size: 60%') ┻━┻
      | Tableflip
    div(v-if='globals.current_user === null')
      // Not logged in
      router-link(:to="{ name: 'LoginPage' }") Sign in
      br
      router-link(:to="{ name: 'RegisterPage' }") Register
    div(v-else)
      // Logged in
      p Logged in as {{ globals.current_user.username }}
      a(v-on:click='signout') Sign out
      br
      router-link(:to="{ name: 'IndexPage' }") Dashboard
      br
      router-link(:to="{ name: 'LobbyPage' }") Lobbies
      h2 Active games
      Spinner(v-if='active_games === undefined')
      p(v-else-if='active_games.length === 0') No active games.
      div(v-for='game in active_games')
        router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
          | {{ game.name }}
      h2 Finished games
      Spinner(v-if='finished_games === undefined')
      p(v-else-if='finished_games.length === 0') No finished games.
      div(v-for='game in finished_games')
        router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
          | {{ game.name }} with {{ game.with }}
</template>
<script>
import Vue from 'vue';
import Spinner from '@/components/Spinner';
import api from '@/api';
import globals from '@/globals';
import router from '@/router';
import games from '@/games/index';

function withPlayersList(game) {
  return game.players
    .filter(player => player.id !== globals.current_user.id)
    .map(player => player.username);
}

function gameView(game) {
  return {
    id: game.id,
    name: (games[game.type] && games[game.type].name) || game.type,
    with: withPlayersList(game).join(', '),
  };
}

export default {
  components: { Spinner },
  computed: {
    active_games() {
      if (this.games === undefined) {
        return undefined;
      }
      return this.games.filter(game => !game.finished)
        .map(gameView);
    },
    finished_games() {
      if (this.games !== undefined) {
        return this.games.filter(game => game.finished)
          .map(gameView);
      }
      return undefined;
    },
  },
  data: () => ({
    globals,
    games: undefined,
  }),
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.games = undefined;
      if (globals.current_user) {
        api.get(`users/${globals.current_user.id}/games`).then((data) => {
          this.games = data;
        });
      }
    },
    signout: () => {
      Vue.set(globals, 'current_user', null);
      this.games = undefined;
      api.get('logout');
      router.push('/login');
    },
  },
};
</script>
<style>
</style>
