<template lang='pug'>
  .lobby-detail-page
    h1 Lobby {{ lobby_id }}
    button(@click='$router.push({ name: "LobbyPage" })') All lobbies
    br
    Spinner(v-if='!lobby')
    .lobby-detail(v-else)
      .lobby-row
        .lobby-section
          h2 Game
          .bignum {{ games[lobby.type].name }}
      .lobby-row
        .lobby-section
          h2 Required players
          .bignum(v-if='games[lobby.type].min_players === games[lobby.type].max_players')
            | {{ games[lobby.type].min_players }}
          .bignum(v-else)
            | {{ games[lobby.type].min_players }} – {{ games[lobby.type].max_players }}
        .lobby-section
          h2 Players
          .bignum {{ lobby.players.length }}
        .lobby-section
          h2 Current players
          .bignum
            span(v-for='(player, idx) in lobby.players')
              span.comma(v-if='idx !== 0')
                | , 
              | {{ player.username }}
          .bignum.faint(v-if='lobby.players.length === 0')
            | None
      .lobby-row
        .lobby-section
          .lobby-controls
            template(v-if='!lobby.game_id')
              button(v-if='in_lobby' @click='leave' key='leave') Leave
              button(v-else @click='join' key='join') Join
              button(@click='start' v-if='lobby.players.length >= games[lobby.type].min_players') Start
            button(v-else @click='view_game') View Game
      .lobby-row
        .lobby-section(v-if='games[lobby.type] && games[lobby.type].rule_text')
          h2 Rules
          ul
            li(v-for='line in games[lobby.type].rule_text') {{ line }}
            li(v-if='games[lobby.type].rule_link')
              a(:href='games[lobby.type].rule_link') More info
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';
import games from '@/games/index';
import globals from '@/globals';

export default {
  components: { Spinner },
  computed: {
    lobby_id() { return this.$route.params.id; },
    current_user() { return globals.current_user; },
    in_lobby() {
      return this.lobby && this.lobby.players.find(
        player => player.id === this.current_user.id,
      );
    },
  },
  data: () => ({
    lobby: undefined,
    games,
  }),
  created() {
    this.startPolling();
  },
  watch: {
    $route: 'startPolling',
  },
  methods: {
    startPolling() {
      this.lobby = undefined;
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
      api.get(`lobbies/${this.lobby_id}`).then((data) => {
        this.lobby = data;
      });
    },
    join() {
      api.post(`lobbies/${this.lobby_id}/join`, {}).then((data) => {
        this.lobby = data;
      });
    },
    leave() {
      api.post(`lobbies/${this.lobby_id}/leave`, {}).then((data) => {
        if (!data.deleted) {
          this.lobby = data;
        } else {
          this.$router.push({ name: 'LobbyPage' });
        }
      });
    },
    start() {
      api.post(`lobbies/${this.lobby_id}/start`, {}).then((data) => {
        this.lobby = data;
        if (data.game_id) {
          this.view_game();
        }
      });
    },
    view_game() {
      this.$router.push({ name: 'GamePage', params: { id: this.lobby.game_id } });
    },
    destroyed() {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    },
  },
  destroyed() {
    clearInterval(this.pollingTimer);
    this.pollingTimer = null;
  },
};
</script>
<style>
.faint {
  color: #888;
}
</style>
