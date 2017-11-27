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
                button(v-if='game.current_turn') Make Move
                button(v-else) View
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
    current_turn: game.current_turn,
  };
}

export default {
  components: { Spinner },
  created() {
    this.startPolling();
  },
  watch: {
    $route: 'startPolling',
  },
  data: () => ({
    globals,
  }),
  computed: {
    activeGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => !game.finished)
          .map(gameView);
      }
      return undefined;
    },
    finishedGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => game.finished)
          .map(gameView);
      }
      return undefined;
    },
  },
  methods: {
    startPolling() {
      globals.poll('indexpage', 'userGames', () => {
        globals.fetchUserGames();
      });
    },
  },
  destroyed() {
    globals.stopPoll('indexpage', 'userGames');
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
