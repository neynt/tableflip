<template lang='pug'>
  .wondersduel
    h1 7 Wonders Duel
    .shared
      p
        strong Progress:
        span(v-for='p in state.unbuilt_progress') {{ rules.progress[p].name }} 
      p(v-if='state.wonders_draft')
        strong Select a wonder:
        .tree
          .row
            Card(v-for='w in state.wonders_draft' :key='w' :wonder='w' @click='draft_wonder(w)')
      .tree(v-if='state.tree.length')
        .row(v-for='(row, i) in state.tree')
          .card.card-align(v-if='i % 2 === 1') &nbsp;
          Card(v-for='(card, j) in row' :key='card' :card='card' :age='state.age'
               @click.native='select_card(i, j)')
      .options(v-if='selection !== null')
        Card(:card='selection')
        br
        button(@click='construct()') Construct 
          GameSymbol(size='12' symbol='coin'
                     :amt='rules.card_coin_cost(state, state.player, selection)')
        button(@click='discard()') Discard
        button(v-for='w in state.unbuilt_wonders[state.player]' @click='wonder(w)')
          | Build {{ rules.wonders[w].name }} 
          GameSymbol(size='12' symbol='coin'
                     :amt='rules.wonder_coin_cost(state, state.player, w)')
      .tree(v-if='false')
        .row
          Card(v-for='card in 73' :key='card' :card='card')
      .tree(v-if='false')
        .row
          Card(v-for='wonder in 12' :key='wonder' :wonder='wonder')
      hr
    .city(v-for='player in [0, 1]')
      h2 {{ username(player) }} 
        GameSymbol(size='20' symbol='coin' :amt='state.coins[player]')
      .tree
        .row
          Card(v-for='card in state.city[player]' :key='card' :card='card')
      p(v-if='state.unbuilt_wonders[player].length')
        strong Unbuilt wonders:
        .tree
          .row
            Card(v-for='w in state.unbuilt_wonders[player]' :key='w' :wonder='w')
      p(v-if='state.wonders[player].length')
        strong Built wonders:
        .tree
          .row
            Card(v-for='w in state.wonders[player]' :key='w' :wonder='w')
      hr
</template>

<script>
import Card from './Card';
import GameSymbol from './GameSymbol';
import rules from './rules';

export default {
  props: ['state', 'players', 'onaction'],
  components: { Card, GameSymbol },
  computed: {
    rules() {
      return rules;
    },
  },
  data() {
    return {
      selection: null,
    };
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
    select_card(row, col) {
      const card = this.state.tree[row][col];
      if (card > 0) {
        // Check that it's legal to select a card right now
        if (rules.is_action_legal(this.state, { type: 'discard', card })) {
          this.selection = card;
        }
      }
    },
    construct() {
      this.onaction({ type: 'construct', card: this.selection });
      this.selection = null;
    },
    discard() {
      this.onaction({ type: 'discard', card: this.selection });
      this.selection = null;
    },
    wonder(wonder) {
      this.onaction({ type: 'wonder', card: this.selection, wonder });
      this.selection = null;
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
.tree {
  margin-bottom: 60px;
}
.row {
  margin-bottom: -60px;
}
.card-align {
  display: inline-block;
  vertical-align: top;
  margin: 2px;
  width: 40px;
  height: 120px;
}
.game-symbol {
  display: inline-block;
}
</style>
