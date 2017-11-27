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
        button(@click='create') Create
      .lobby-section(v-if='selected_game && selected_game.rule_text')
        h2 Rules
        ul
          li(v-for='line in selected_game.rule_text') {{ line }}
          li(v-if='selected_game.rule_link')
            a(:href='selected_game.rule_link') More info
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';
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
      if (!this.selected_type) {
        return;
      }
      api.post('lobbies', {
        type: this.selected_type,
      }).then((data) => {
        this.$router.push({ name: 'LobbyDetailPage', params: { id: data.id } });
      });
    },
  },
};
</script>
<style>
</style>
