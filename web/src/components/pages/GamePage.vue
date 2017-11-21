<template lang='pug'>
  .game-page
    component(v-if="gameState" :is="gameView" :state="gameState" :players="players" :onaction="onAction")
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
    players: undefined,
  }),
  methods: {
    startPolling() {
      this.gameState = undefined;
      this.fetchData();
      if (this.pollingTimer) {
        clearInterval(this.pollingTimer);
      }
      this.pollingTimer = setInterval(() => {
        this.fetchData();
      }, 1000);
      this.fetchData();
    },
    fetchData() {
      const expectedGameId = this.gameId;
      api.get(`games/${this.gameId}`).then((data) => {
        if (this.gameId !== expectedGameId) return;
        this.gameType = data.type;
        this.gameState = data.view;
        this.players = data.players;
      }).catch(() => {
        if (this.gameId !== expectedGameId) return;
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
    this.pollingTimer = null;
  },
};
</script>
<style>
</style>
