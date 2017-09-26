<template lang='pug'>
  .game-page
    component(v-if="gameState" :is="gameView" :state="gameState")
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
    gameState: null,
  }),
  methods: {
    fetch_data() {
      const that = this;
      api.get(`games/${this.gameId}`).then((data) => {
        that.gameState = data.state;
      }).catch((err) => {
        console.log(err);
        that.gameState = null;
      });
    },
  },
};
</script>
<style>
</style>
