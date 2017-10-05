<template lang='pug'>
  .lobby-detail-page
    h1 Lobby {{ lobby_id }}
    button(@click='$router.push({ name: "LobbyPage" })') All lobbies
    br
    Spinner(v-if='!lobby')
    .lobby(v-else)
      .lobby-detail
        .lobby-row
          .lobby-section
            h2 Game
            .bignum {{ lobby.type }}
          .lobby-section
            h2 Players
            .bignum {{ lobby.players.length }}
          .lobby-section
            h2 Required players
            .bignum(v-if='lobby.min_players === lobby.max_players')
              | {{ lobby.min_players }}
            .bignum(v-else)
              | {{ lobby.min_players }} – {{ lobby.max_players }}
        .lobby-row
          .lobby-section
            h2 Current players
            .player-list
              .player-item(v-for='player in lobby.players')
                | {{ player.username }}
            .bignum(v-if='lobby.players.length === 0')
              | None
        .lobby-controls
          button(@click='join') Join
          button(@click='start') Start
</template>
<script>
import api from '@/api';
import Spinner from '@/components/Spinner';

export default {
  components: { Spinner },
  computed: {
    lobby_id() { return this.$route.params.id; },
  },
  data: () => ({
    lobby: undefined,
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    fetchData() {
      api.get(`lobbies/${this.lobby_id}`).then((data) => {
        this.lobby = data;
      });
    },
    join() {
      // TODO
    },
    start() {
      // TODO
    },
  },
};
</script>
<style>
.player-list {
  margin-left: 20px;
}
</style>
