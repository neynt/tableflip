<template lang='pug'>
  .game-page
    component(v-if="gameState" :is="gameView" :state="gameState")
    div(v-if="gameState === null")
      h2 Game not found. (╯°□°)╯︵ ┻━┻
</template>
<script>
import Connect4View from '@/games/connect4/View';
import api from '@/api';

export default {
  computed: {
    gameId() { return this.$route.params.id; },
    gameView() { return Connect4View; },
  },
  created() {
    this.fetch_data();
  },
  watch: {
    $route: 'fetch_data',
  },
  data: () => ({
    gameState: undefined,
  }),
  methods: {
    fetch_data() {
      this.gameState = undefined;
      api.get(`games/${this.gameId}`).then((data) => {
        this.gameState = data.state;
      }).catch(() => {
        this.gameState = null;
      });
    },
  },
};
</script>
<style>
</style>
