<template lang='pug'>
  .hanabi
    .info
      | Cards in deck: {{ state.deck_size }}
      br
      | Hints: {{ state.hints }}
      br
      | Lives: {{ state.lives }}
      template(v-if='state.turns_remaining !== null && state.turns_remaining !== undefined')
        br
        | Turns Remaining: {{ state.turns_remaining }}
    .hands
      .hand(v-for='(hand, player) in state.hands')
        .row
          .label(v-if='player === state.player') You
          .label(v-else) Player {{ player }}
          .card(v-for='(card, index) in hand'
                v-bind:class='colour_dict(colour(card))')
            .number {{ number(card) || '&nbsp;' }}
            .hint(v-bind:class='colour_dict(state.hinted[player][index].colour)')
              | {{ state.hinted[player][index].number || '&nbsp;' }}
        .row(v-if='state.player === state.current_player && player !== state.player && !is_game_finished')
          .label.small Hint
          .hint(v-for='(_, colour) in state.plays'
                v-bind:class='colour_dict(colour)'
                @click='hint(player, colour, undefined)')
            | &nbsp;
          .hint(v-for='number in 5'
                @click='hint(player, undefined, number)')
            | {{ number }}
        .row(v-else-if='state.player === state.current_player && !is_game_finished')
          .label
          .buttons(v-for='(_, index) in hand')
            .button(@click='play(index)') Play
            .button(@click='discard(index)') Discard
    .plays
      .row
        .label Plays
        .card(v-for='(number, colour) in state.plays'
              v-bind:class='colour_dict(colour)')
          .number {{ number || '&nbsp;' }}
    .discards
      .row
        .label Discards
        .card(v-for='card in sorted_discards'
              v-bind:class='colour_dict(colour(card))')
          .number {{ number(card) }}
</template>
<script>
import rules from './rules';

export default {
  props: ['state', 'onaction'],
  computed: {
    is_game_finished() {
      return rules.is_game_finished(this.state);
    },
    sorted_discards() {
      const discards = this.state.discards.slice();
      return discards.sort((a, b) => a - b);
    },
  },
  methods: {
    colour(card) {
      return Math.floor(card / 5);
    },
    colour_dict(colour) {
      return {
        red: colour === 0,
        yellow: colour === 1,
        green: colour === 2,
        blue: colour === 3,
        white: colour === 4,
      };
    },
    number(card) {
      return (card % 5) + 1;
    },
    play(index) {
      this.onaction({
        type: 'play',
        index,
      });
    },
    discard(index) {
      this.onaction({
        type: 'discard',
        index,
      });
    },
    hint(player, colour, number) {
      this.onaction({
        type: 'hint',
        player,
        colour,
        number,
      });
    },
  },
};
</script>
<style scoped>
.hands {
  display: inline-block;
}
.row {
  display: block;
  padding: 0;
}
.label {
  display: inline-block;
  width: 100px;
  font-size: 25px;
  vertical-align: top;
  padding-top: 35px;
}
.label.small {
  padding-top: 0px;
  font-size: 20px;
}
.card {
  display: inline-block;
  background: #aaa;
  width: 50px;
  height: 80px;
  padding: 0;
  font-size: 30px;
  text-align: center;
  border-radius: 10px;
  margin: 10px;
  border: 1px solid black;
  cursor: default;
}
.buttons {
  display: inline-block;
  background: #fff;
  width: 50px;
  padding: 0;
  margin: 0px 10px;
}
.button {
  font-size: 15px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid black;
  width: 50px;
  cursor: pointer;
  margin: 5px 0;
  padding: 5px 0;
  text-align: center;
}
.number {
  height: 40px;
}
.hint {
  display: inline-block;
  text-align: center;
  font-size: 25px;
  border-radius: 10px;
  width: 30px;
  height: 30px;
  border: 1px solid #000;
  margin: 0 5px;
  background: #aaa;
  cursor: pointer;
}
.card .hint {
  margin: 0 auto;
  cursor: default;
}
/* Colours */
.red {
  background: #f40;
}
.yellow {
  background: #ff0;
}
.green {
  background: #0c0;
}
.blue {
  background: #08f;
}
.white {
  background: #fff;
}
</style>
