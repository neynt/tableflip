<template lang='pug'>
  .game-page
    component(v-if="gameState" :is="gameView" :state="gameState" :onaction="onAction")
    div(v-if="gameState === undefined")
      Spinner
    div(v-if="gameState === null")
      h2 Game not found. (╯°□°)╯︵ ┻━┻
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';
import games from '@/games/index';

export default {
  components: { Spinner },
  computed: {
    gameId() { return this.$route.params.id; },
    gameView() {
      if (this.gameType !== undefined) {
        return games[this.gameType].view;
      }
      return undefined;
    },
  },
  created() {
    this.startPolling();
  },
  watch: {
    $route: 'startPolling',
  },
  data: () => ({
    gameType: undefined,
    gameState: undefined,
  }),
  methods: {
    startPolling() {
      this.gameState = undefined;
      this.fetchData();
      const that = this;
      this.pollingTimer = setInterval(() => {
        that.fetchData();
      }, 1000);
    },
    fetchData() {
      api.get(`games/${this.gameId}`).then((data) => {
        this.gameType = data.type;
        this.gameState = data.view;
      }).catch(() => {
        this.gameState = null;
      });
    },
    onAction(action) {
      api.post(`games/${this.gameId}/action`, {
        action,
      }).then((data) => {
        this.gameState = data.view;
      });
    },
  },
  destroyed() {
    clearInterval(this.pollingTimer);
  },
};
</script>
<style>
</style>
