<template lang='pug'>
  .lobby-page
    h1 Lobbies
    button(@click='$router.push({ name: "CreateLobbyPage" })') Create new lobby
    br
    Spinner(v-if='lobbies === undefined')
    .lobbies(v-else)
      .lobby(v-for='(lobby, idx) in lobbies')
        .lobby-row
          .lobby-section
            h2 Game
            .bignum {{ games[lobby.type] && games[lobby.type].name || lobby.type }} 
        .lobby-row
          .lobby-section
            h2 Players
            .bignum {{ lobby.players.length }}
          .lobby-section
            h2 Required players
            .bignum(v-if='lobby.min_players === lobby.max_players')
              | {{ lobby.min_players }}
            .bignum(v-else)
              | {{ lobby.min_players }} – {{ lobby.max_players }}
        .lobby-controls
          button.even(@click='viewDetails(lobby.id)') View
</template>
<script>
import api from '@/api';
import Spinner from '@/components/Spinner';
import games from '@/games/index';

export default {
  components: { Spinner },
  computed: {
    lobby_id() {
      return this.route.params.id;
    },
  },
  data: () => ({
    lobbies: undefined,
    games,
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
    viewDetails(id) {
      this.$router.push({ name: 'LobbyDetailPage', params: { id } });
    },
  },
};
</script>
<style>
</style>
