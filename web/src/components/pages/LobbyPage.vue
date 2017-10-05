<template lang='pug'>
  .lobby-page
    h1 Lobby
    button Create new game
    br
    Spinner(v-if='lobbies === undefined')
    .lobbies(v-else)
      .lobby(v-for='lobby in lobbies')
        .lobby-type {{ lobby.type }} 
        .lobby-info
          .lobby-info-section
            h2 Players
            .bignum {{ lobby.players.length }}
          .lobby-info-section
            h2 Required players
            .bignum(v-if='lobby.min_players === lobby.max_players')
              | {{ lobby.min_players }}
            .bignum(v-else)
              | {{ lobby.min_players }} – {{ lobby.max_players }}
        .lobby-controls
          button.even View
</template>
<script>
import api from '@/api';
import Spinner from '@/components/Spinner';

export default {
  components: { Spinner },
  data: () => ({
    lobbies: undefined,
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      api.get('lobbies').then((data) => {
        this.lobbies = data;
      });
    },
  },
};
</script>
<style>
.lobby {
  display: inline-block;
  border: 2px solid #aaa;
  padding: 10px;
}
.lobby-info {
  display: flex;
  flex-direction: row;
}
.lobby-info-section {
  margin: 0px 10px;
}
.lobby-info-section h2 {
  font-size: 100%;
}
.bignum {
  font-size: 200%;
}
.lobby-type {
  font-size: 130%;
}
.lobby-controls {
  text-align: right;
}
</style>
