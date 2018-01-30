<template lang='pug'>
  .wondersduel
    h1 7 Wonders Duel
    p
      strong {{ prompt() }}
    .shared
      svg(viewBox='0 0 570 120' width='570' height='120')
        GameSymbol(size='20' symbol='victory' amt='10' x='65' y='30')
        GameSymbol(size='20' symbol='victory' amt='5' x='155' y='30')
        GameSymbol(size='20' symbol='victory' amt='2' x='230' y='30')
        GameSymbol(size='20' symbol='victory' amt='2' x='320' y='30')
        GameSymbol(size='20' symbol='victory' amt='5' x='395' y='30')
        GameSymbol(size='20' symbol='victory' amt='10' x='485' y='30')
        g(v-for='i in 4' v-if='state.military_tokens[i - 1]')
          rect(:x='military_token_x(i - 1)' y='25' width='80' height='30' fill='#B1392C' rx='5' ry='5')
          GameSymbol(size='20' symbol='takecoins' :x='military_token_x(i - 1) + 30' y='30'
                     :amt='i === 1 || i === 4 ? 5 : 2')
        rect(v-for='i in 19' :x='(i - 1) * 30 + 5' y='60' width='20' height='50' rx='10' ry='25'
             :fill='(i - 10 === state.military) ? "#B1392C" : "#FFFFFF"' stroke='#000000')
        path(d='M30 25l0 90m90 0l0 -90m90 0l0 90m60 0l0 -90m30 0l0 90m60 0l0 -90m90 0l0 90m90 0l0 -90' stroke='#000000' stroke-width='2')
        text(x='0' y='15' font-size='20px') {{ username(0) }}
        text(x='570' y='15' font-size='20px' text-anchor='end') {{ username(1) }}
      p
        strong Progress:
        span(v-for='p in state.unbuilt_progress') {{ rules.progress[p].name }} 
      p(v-if='state.wonders_draft')
        strong Select a wonder:
        .tree
          .row
            Card(v-for='w in state.wonders_draft' :key='w' :wonder='w'
                 @click.native='draft_wonder(w)')
      .tree(v-if='state.tree.length')
        .row(v-for='(row, i) in tree')
          .card.card-align(v-if='i % 2 === 1') &nbsp;
          Card(v-for='(card, j) in row' :key='card' :card='card' :age='state.age'
               @click.native='select_card(i, j)')
    .options(v-if='state.player === state.current && !rules.is_game_finished(state)')
      .pass-option(v-if='state.first_turn || state.destroy_resource || state.mausoleum')
        button(@click='pass()') Pass
      .selection-options(v-if='selection !== null')
        Card(:card='selection')
        br
        button(@click='construct()') Construct 
          GameSymbol(size='12' symbol='coin'
                     :amt='rules.card_coin_cost(state, state.player, selection)')
        button(@click='discard()') Discard
        button(v-if='state.wonders[0].length + state.wonders[1].length < 7'
               v-for='w in state.unbuilt_wonders[state.player]' @click='wonder(w)')
          | Build {{ rules.wonders[w].name }} 
          GameSymbol(size='12' symbol='coin'
                     :amt='rules.wonder_coin_cost(state, state.player, w)')
      .progress-options(v-if='state.progress_choice')
        p
          span(v-for='p in state.progress_choice')
            a(@click='select_progress(p)') {{ rules.progress[p].name }}
    hr
    .tree(v-if='false')
      .row
        Card(v-for='card in 73' :key='card' :card='card')
    .tree(v-if='false')
      .row
        Card(v-for='wonder in 12' :key='wonder' :wonder='wonder')
    .city(v-for='player in [state.player, 1 - state.player]')
      h2 {{ username(player) }} 
        GameSymbol(size='20' symbol='coin' :amt='state.coins[player]')
      p(v-if='state.progress[player].length')
        span(v-for='p in state.progress[player]') {{ rules.progress[p].name }}
      .stack(v-for='stack in card_stacks(state.city[player])')
        .stack-card(v-for='card in stack')
          Card(:card='card' @click.native='destroy_resource(card)')
      p(v-if='state.wonders[player].length')
        strong Built wonders
        .tree
          .row
            Card(v-for='w in state.wonders[player]' :key='w' :wonder='w')
      p(v-if='state.unbuilt_wonders[player].length')
        strong Unbuilt wonders
        .tree
          .row
            Card(v-for='w in state.unbuilt_wonders[player]' :key='w' :wonder='w')
      hr
    .log
      p(v-for='e in state.log') {{ log_message(e) }}
    .discards
      .stack(v-for='stack in card_stacks(state.discard)')
        .stack-card(v-for='card in stack')
          Card(:card='card' @click.native='resurrect(card)')
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
    tree() {
      // Trim the tree
      function trim(row) {
        let end = row.length;
        while (end > 0 && (row[end - 1] === 0 || row[end - 1].length === 0)) {
          end -= 1;
        }
        return row.slice(0, end);
      }
      return trim(this.state.tree.map(trim));
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
    pass() {
      this.onaction({ type: 'pass' });
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
    select_progress(progress) {
      this.onaction({ type: 'select_progress', progress });
    },
    destroy_resource(card) {
      this.onaction({ type: 'destroy', card });
    },
    resurrect(card) {
      this.onaction({ type: 'resurrect', card });
    },
    military_token_x(i) {
      if (i <= 1) {
        return 35 + (i * 90);
      }
      return 185 + (i * 90);
    },
    card_stacks(city) {
      const stacks = [[], [], [], [], [], [], []];
      for (let i = 0; i < city.length; i += 1) {
        const card = rules.cards[city[i]];
        stacks[card.colour - 1].push(city[i]);
      }
      return stacks;
    },
    prompt() {
      if (rules.is_game_finished(this.state)) {
        const winners = rules.winners(this.state);
        if (winners.length === 2) {
          return 'The game is a tie.';
        }
        if (winners.length === 1) {
          if (Math.abs(this.state.military) >= 9) {
            return `The winner is ${this.username(winners[0])} by military.`;
          } else if (rules.science_count(this.state, 0) >= 6 ||
                     rules.science_count(this.state, 1) >= 6) {
            return `The winner is ${this.username(winners[0])} by science.`;
          }
          const scores = [rules.victory_count(this.state, 0),
                          rules.victory_count(this.state, 1)];
          return `The winner is ${this.username(winners[0])} by victory points, ` +
            `${scores[winners[0]]} to ${scores[1 - winners[0]]}.`;
        }
      }
      const u = this.username(this.state.current);
      if (this.state.wonders_draft) {
        return `${u}, choose a wonder.`;
      } else if (this.state.progress_choice) {
        return `${u}, choose a progress token.`;
      } else if (this.state.mausoleum) {
        return `${u}, choose a card from the discard to build.`;
      } else if (this.state.destroy_resource) {
        const colour = this.state.destroy_resource === 1 ? 'brown' : 'grey';
        return `${u}, choose a ${colour} card to destroy.`;
      }
      return `${u}, choose a card to play or discard, or build a wonder.`;
    },
    log_message(e) {
      const u = e.type !== 'age' ? this.username(e.player) : null;
      if (e.type === 'construct') {
        return `${u} built ${rules.cards[e.card].name}.`;
      } else if (e.type === 'discard') {
        return `${u} discarded ${rules.cards[e.card].name} for coins.`;
      } else if (e.type === 'wonder') {
        return `${u} used ${rules.cards[e.card].name} to build ${rules.wonders[e.wonder].name}.`;
      } else if (e.type === 'pass') {
        return `${u} passed.`;
      } else if (e.type === 'draft_wonder') {
        return `${u} chose ${rules.wonders[e.wonder].name}.`;
      } else if (e.type === 'destroy') {
        return `${u} destroyed ${rules.cards[e.card].name}.`;
      } else if (e.type === 'resurrect') {
        return `${u} built ${rules.cards[e.card].name} from the discard pile.`;
      } else if (e.type === 'age') {
        return `Age ${new Array(e.age + 1).join('I')} has begun.`;
      } else if (e.type === 'goagain') {
        return `${u} took another turn.`;
      }
      return '';
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
.stack {
  margin-bottom: 90px;
  display: inline-block;
  vertical-align: top;
}
.stack-card {
  margin-bottom: -90px;
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
