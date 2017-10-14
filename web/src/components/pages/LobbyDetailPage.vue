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
            .bignum {{ games[lobby.type].name }}
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
        .lobby-row
          .lobby-section
            h2 Current players
            .bignum
              span(v-for='(player, idx) in lobby.players')
                span.comma(v-if='idx !== 0')
                  | , 
                | {{ player.username }}
            .bignum.faint(v-if='lobby.players.length === 0')
              | None
        .lobby-controls
          template(v-if='!lobby.game_id')
            button(v-if='in_lobby' @click='leave' key='leave') Leave
            button(v-else @click='join' key='join') Join
            button(@click='start') Start
          button(v-else @click='view_game') View Game
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
      if (!this.lobby) {
        return false;
      }
      const rval = this.lobby.players.find(
        player => player.id === this.current_user.id,
      ) !== undefined;
      return rval;
    },
  },
  data: () => ({
    lobby: undefined,
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
      console.log(this.lobby.game_id);
      this.$router.push({ name: 'GamePage', params: { id: this.lobby.game_id } });
    },
  },
};
</script>
<style>
.faint {
  color: #888;
}
</style>
