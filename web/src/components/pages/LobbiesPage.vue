<template lang='pug'>
  .lobby-page
    h1 Lobbies
    button(@click='$router.push({ name: "CreateLobbyPage" })') Create new lobby
    br
    Spinner(v-if='!globals.lobbies')
    .lobbies(v-else)
      .lobby(v-for='(lobby, idx) in globals.lobbies')
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
            .bignum(v-if='games[lobby.type].min_players === games[lobby.type].max_players')
              | {{ games[lobby.type].min_players }}
            .bignum(v-else)
              | {{ games[lobby.type].min_players }} – {{ games[lobby.type].max_players }}
        .lobby-controls
          button.even(@click='viewDetails(lobby.id)') View
</template>
<script>
import Spinner from '@/components/Spinner';
import games from '@/games/index';
import globals from '@/globals';

export default {
  components: { Spinner },
  data: () => ({
    games,
    globals,
  }),
  created() {
    this.startPolling();
  },
  watch: {
    $route: 'startPolling',
  },
  methods: {
    viewDetails(id) {
      this.$router.push({ name: 'LobbyDetailPage', params: { id } });
    },
    startPolling() {
      globals.poll('lobbiespage', 'lobbies', () => {
        globals.fetchLobbies();
      });
    },
  },
  destroyed() {
    globals.stopPoll('lobbiespage', 'lobbies');
  },
};
</script>
<style>
</style>
