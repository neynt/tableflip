<template lang='pug'>
  div
    h1.logo(@click='router.push({ name: "IndexPage" })')
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
      router-link(:to="{ name: 'LobbyPage' }") Lobbies
      h2 Active games
      Spinner(v-if='activeGames === undefined')
      p(v-else-if='activeGames.length === 0') No active games.
      div(v-for='game in activeGames')
        router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
          | {{ game.name }} with {{ game.with }}
      h2 Finished games
      Spinner(v-if='finishedGames === undefined')
      p(v-else-if='finishedGames.length === 0') No finished games.
      div(v-for='game in finishedGames')
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
    activeGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => !game.finished)
          .map(gameView);
      }
      return undefined;
    },
    finishedGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => game.finished)
          .map(gameView);
      }
      return undefined;
    },
  },
  created() {
    this.startPolling();
  },
  data: () => ({
    globals,
    router,
  }),
  methods: {
    startPolling() {
      globals.poll('sidebar', 'userGames', () => {
        globals.fetchUserGames();
      }, 5000);
    },
    signout: () => {
      Vue.set(globals, 'current_user', null);
      globals.userGames = null;
      api.get('logout');
      router.push('/login');
    },
  },
  destroyed() {
    globals.stopPoll('sidebar', 'userGames');
  },
};
</script>
<style>
.logo:hover {
  cursor: pointer;
}
</style>
