<template lang='pug'>
  .euchre
    h2 Scores {{ state.scores[0] }} - {{ state.scores[1] }}
    h2 Players
    .player(v-for='(play, i) in state.plays')
      h3 Player {{ i + 1 }}
        span(v-if='state.player === i')  - You
        span(v-if='state.dealer === i')  - Dealer
        span(v-if='state.leader === i')  - Led
        span(v-if='state.bidder === i')  - Bid
          span(v-if='state.alone') (playing alone)
        span(v-if='state.current_player === i')  - Current Player
      .card(v-if='play' v-bind:class='[suit_class(card_suit(play))]')
        | {{ value(play) }}<br>{{ suit(card_suit(play)) }}
      p Tricks: {{ state.tricks[i].length }}
    h2 Your Hand
    .card(v-for='(card, i) in state.hand'
          v-bind:class='["clickable", suit_class(card_suit(card))]'
          @click='click(i)')
      | {{ value(card) }}<br>{{ suit(card_suit(card)) }}
    h2 Trump Card
    .card(v-bind:class='[suit_class(card_suit(state.trump_card))]')
      | {{ value(state.trump_card) }}<br>{{ suit(card_suit(state.trump_card)) }}
    .trumpsuit(v-if='state.trump')
      h2 Trump Suit:
        span(v-bind:class='[suit_class(state.trump)]')  {{ suit(state.trump) }}
    .controls(v-if='state.current_player === state.player')
      h2 Controls
      .bidbuttons(v-if='state.stage === 1')
        button(@click='bid') Bid
        button(@click='pass') Pass
      .suitbuttons(v-if='state.stage === 2')
        | Propose Trump: 
        button(v-for='s in 4'
               v-bind:class='[suit_class(s - 1)]'
               @click='propose(s)') {{ suit(s - 1) }}
</template>
<script>
export default {
  props: ['state', 'onaction'],
  methods: {
    card_suit(card) {
      return Math.floor(card / 13);
    },
    suit_class(suit) {
      return ['spades', 'hearts', 'clubs', 'diams'][suit];
    },
    suit(suit) {
      return '♠♥♣♦'[suit];
    },
    value(card) {
      return 'A23456789TJQK'[card % 13];
    },
    click(index) {
      if (this.state.stage === 3) {
        this.onaction({
          type: 'pickup',
          index,
        });
      } else {
        this.onaction({
          type: 'play',
          index,
        });
      }
    },
    propose(suit) {
      this.onaction({
        type: 'propose',
        suit,
        alone: false, // TODO
      });
    },
    bid() {
      this.onaction({
        type: 'bid',
        alone: false, // TODO
      });
    },
    pass() {
      this.onaction({
        type: 'pass',
      });
    },
  },
};
</script>
<style scoped>
.row {
  display: block;
  padding: 0;
}
.card {
  display: inline-block;
  background: #fff;
  width: 50px;
  height: 70px;
  padding: 0;
  font-size: 30px;
  text-align: center;
  border-radius: 10px;
  margin: 3px;
  border: 1px solid black;
  cursor: default;
}
.clickable {
  cursor: pointer;
}
.spades, .clubs {
  colour: #000;
}
.hearts, .diams {
  color: #f00;
}
</style>
