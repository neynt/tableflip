<template lang='pug'>
  .main-page
    .main-content(v-if='globals.current_user')
      h1 Dashboard
      .active-games(v-if='userActiveGames && userActiveGames.length > 0')
        h2 Your active games
        .lobbies
          .lobby(v-for='game in userActiveGames')
            .lobby-row
              .lobby-section
                .bignum {{ game.name }}
                h2 With {{ game.with }}
            .lobby-controls
              router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
                button(v-if='game.current_turn') Make Move
                button(v-else) View
      div(v-else-if='userActiveGames')
        h2
          | You have no active games. 
          router-link(:to="{ name: 'LobbyPage' }") Create or join one!
      Spinner(v-else)
      .other-games(v-if='otherActiveGames && otherActiveGames.length > 0')
        h2 Other active games
        .lobbies
          .lobby(v-for='game in otherActiveGames')
            .lobby-row
              .lobby-section
                .bignum {{ game.name }}
                h2 {{ game.with }}
            .lobby-controls
              router-link(:to="{ name: 'GamePage', params: { id: game.id } }")
                button View
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
    userActiveGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => !game.finished)
          .map(gameView);
      }
      return undefined;
    },
    userFinishedGames() {
      if (globals.userGames) {
        return globals.userGames.filter(game => game.finished)
          .map(gameView);
      }
      return undefined;
    },
    otherActiveGames() {
      if (globals.activeGames) {
        return globals.activeGames.filter(game => !game.players.find(
            player => player.id === globals.current_user.id))
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
      globals.poll('indexpage', 'activeGames', () => {
        globals.fetchActiveGames();
      });
    },
  },
  destroyed() {
    globals.stopPoll('indexpage', 'userGames');
    globals.stopPoll('indexpage', 'activeGames');
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
