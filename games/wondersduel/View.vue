<template lang='pug'>
  .wondersduel
    h1 7 Wonders Duel
    .shared
      p
        strong Progress:
        span(v-for='p in state.unbuilt_progress') {{ rules.progress[p].name }} 
      p(v-if='state.wonders_draft')
        strong Select a wonder:
        span(v-for='w in state.wonders_draft')
          a(@click='draft_wonder(w)') {{ rules.wonders[w].name }}
      .tree(v-if='state.tree.length')
        .row(v-for='(row, i) in state.tree')
          .card.card-align(v-if='i % 2 === 1') &nbsp;
          .card(v-for='card in row')
            .face(v-if='card > 0') {{ rules.cards[card].name }}
            .space(v-else-if='card === 0') &nbsp;
            .back(v-else) &nbsp;
      hr
    .city(v-for='player in [0, 1]')
      h2 {{ username(player) }}
        span(v-if='state.current === player') *
      p(v-if='state.unbuilt_wonders[player].length')
        strong Unbuilt wonders:
        span(v-for='w in state.unbuilt_wonders[player]') {{ rules.wonders[w].name }}
      p(v-if='state.wonders[player].length')
        strong Built wonders:
        span(v-for='w in state.wonders[player]') {{ rules.wonders[w].name }}
      hr
</template>

<script>
import rules from './rules';

export default {
  props: ['state', 'players', 'onaction'],
  computed: {
    rules() {
      return rules;
    },
  },
  methods: {
    draft_wonder(wonder) {
      this.onaction({
        type: 'draft_wonder',
        wonder,
      });
    },
    username(player_id) {
      const player = this.players.find(p => p.player_id === player_id);
      return player && player.username;
    },
  },
};
</script>

<style scoped>
p span {
  margin: 0 5px;
}
hr {
  margin: 10px 0;
}
.card {
  display: inline-block;
  vertical-align: top;
  margin: 2px;
}
.card-align {
  width: 30px;
  height: 90px;
}
.card div {
  width: 60px;
  height: 90px;
  padding: 5px;
  word-wrap: break-word;
}
.card .face {
  border: 1px solid black;
}
.card .back {
  background: #222;
}
.card .space {}
</style>
