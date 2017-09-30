<template lang='pug'>
  .game-page
    component(v-if="gameState" :is="gameView" :state="gameState" :onaction="onAction")
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
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  data: () => ({
    gameState: undefined,
  }),
  methods: {
    fetchData() {
      this.gameState = undefined;
      api.get(`games/${this.gameId}`).then((data) => {
        this.gameState = data.view;
      }).catch(() => {
        this.gameState = null;
      });
    },
    onAction(action) {
      // TODO: Send action to the API.
      console.log(action);
    },
  },
};
</script>
<style>
</style>
