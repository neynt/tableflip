<template lang='pug'>
  .main-page
    .main-content(v-if='globals.current_user')
      h1 Dashboard
      .active-games(v-if='activeGames && activeGames.length > 0')
        h2 Active games
        .lobbies
          .lobby(v-for='game in activeGames')
            .lobby-row
              .lobby-section
                .bignum {{ game.name }}
                h2 With {{ game.with }}
            .lobby-controls
              router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
                button View
      div(v-else-if='activeGames')
        h2
          | No active games. 
          router-link(:to="{ name: 'LobbyPage' }") Create or join one!
      Spinner(v-else)
    .main-content(v-else)
      h1 Welcome to Tableflip — Board Game Server.
      h1 (╯°□°)╯︵ ┻━┻
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';
import globals from '@/globals';
import games from '@/games/index';

function withPlayersList(game) {
  return game.players
    .filter(player => player.id !== globals.current_user.id)
    .map(player => player.username);
}

function gameView(game) {
  return {
    id: game.id,
    name: (games[game.type] && games[game.type].name) || game.type,
    with: withPlayersList(game).join(', '),
  };
}

export default {
  components: { Spinner },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  data: () => ({
    lobbies: undefined,
    globals,
  }),
  computed: {
    activeGames() {
      if (globals.games) {
        return globals.games.filter(game => !game.finished)
          .map(gameView);
      }
      return undefined;
    },
    finishedGames() {
      if (globals.games) {
        return globals.games.filter(game => game.finished)
          .map(gameView);
      }
      return undefined;
    },
  },
  methods: {
    fetchData() {
      this.lobbies = undefined;
      api.get('lobbies').then((data) => {
        this.lobbies = data;
      });
    },
  },
};
</script>
<style>
.main-page {
  height: 100%;
  min-height: 100%;
}
.main-content {
}
</style>
