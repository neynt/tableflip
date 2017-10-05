<template lang='pug'>
  .lobby-page
    h1 Create lobby
    .lobby-detail
      .lobby-section
        h2 Game
        select(v-model='selected_type')
          option(
            v-for='(game, type) in games'
            :value='type'
          ) {{ game.name }}
      .lobby-section(v-if='selected_game')
        h2 Required players
        .bignum(v-if='selected_game.min_players === selected_game.max_players')
          | {{ selected_game.min_players }}
        .bignum(v-else)
          | {{ selected_game.min_players }} – {{ selected_game.max_players }}
      .lobby-section
        div
          button(@click='create') Create
</template>
<script>
import Spinner from '@/components/Spinner';
import games from '@/games/index';

export default {
  components: { Spinner },
  computed: {
    selected_game() { return games[this.selected_type]; },
  },
  data: () => ({
    selected_type: undefined,
    games,
  }),
  methods: {
    create() {
    },
  },
};
</script>
<style>
</style>
