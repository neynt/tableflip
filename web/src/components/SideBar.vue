<template>
  <div>
    <h1>Tableflip</h1>
    <router-link :to="{ name: 'LoginPage' }">Sign in</router-link><br />
    <router-link :to="{ name: 'IndexPage' }">Lobby</router-link>
    <h2>Active games</h2>
    <div v-for='game in active_games'>
      <router-link :to="{ name: 'GamePage', params: { id: game.id } }">
        {{ game.name }}
      </router-link>
    </div>
    <h2>Finished games</h2>
    <div v-for='game in finished_games'>
      <router-link :to="{ name: 'GamePage', params: { id: game.id } }">
        {{ game.name }}
      </router-link>
    </div>
  </div>
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
};
</script>
<style>
</style>
