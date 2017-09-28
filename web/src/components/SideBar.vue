<template lang='pug'>
  div
    h1 Tableflip
    // TODO: Fix this -if's after login works.
    // Currently we show everything for debugging.
    div(v-if='current_user === null')
      router-link(:to="{ name: 'LoginPage' }") Sign in
      br
      router-link(:to="{ name: 'RegisterPage' }") Register
    div(v-if='true')
      a(href='#TODO') Sign out
      br
      router-link(:to="{ name: 'IndexPage' }") Lobby

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
    current_user: null,
  }),
};
</script>
<style>
</style>
