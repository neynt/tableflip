<template lang='pug'>
  div
    h1 Tableflip
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
      div(v-for='game in active_games')
        router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
          | {{ game.name }}
      h2 Finished games
      div(v-for='game in finished_games')
        router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
          | {{ game.name }}
</template>
<script>
import Vue from 'vue';
import api from '@/api';
import globals from '@/globals';
import router from '@/router';

export default {
  computed: {
    active_games: () => [
      { id: 1, name: 'Connect 4 with Jim' },
      { id: 2, name: 'Connect 4 with Dmitri' },
    ],
    finished_games: () => [
      { id: 3, name: 'Connect 4 with Lynn' },
      { id: 4, name: 'Connect 4 with Charles' },
    ],
  },
  data: () => ({
    globals,
  }),
  methods: {
    signout: () => {
      Vue.set(globals, 'current_user', null);
      api.get('logout');
      router.push('/login');
    },
  },
};
</script>
<style>
</style>
