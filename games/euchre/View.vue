<template lang='pug'>
  .euchre
    svg.fill(viewBox='0 0 600 800')
      svg(
        v-for='(play, i) in state.plays'
        :x='seatX(i)'
        :y='seatY(i)'
        width='200'
        height='200'
      )
        rect(
          width='180'
          height='180'
          x='10'
          y='10'
          rx='5'
          ry='5'
          fill='#fff'
          stroke='#222'
        )
        text(x='20' y='35' font-size='20px') {{ username(i) }}
        text(v-if='i === state.dealer' x='20' y='175' font-size='20px') D
        text(v-if='i === state.bidder' x='165' y='175' font-size='20px') B
        g(v-for='(trick, j) in state.tricks[i]')
          text(v-for='(card, k) in trick' :x='trickX(k)' :y='trickY(j)' font-size='14px'
               v-bind:class='[suitClass(cardSuit(card))]') {{ value(card) }} {{ suit(cardSuit(card)) }}
        svg.card(v-if='play !== null'
            width='60'
            height='80'
            viewBox='-5 -5 60 80'
            x='70'
            y='100'
            v-bind:class='[suitClass(cardSuit(play))]')
          rect(
            width='50'
            height='70'
            fill='#fff'
            stroke='#222'
            rx='10'
            ry='10'
          )
          text(x='25' y='32') {{ value(play) }}
          text(x='25' y='60') {{ suit(cardSuit(play)) }}
        svg(v-if='i === state.current_player' x='150' y='10' width='40px' height='40px'
            viewBox='0 0 100 100' preserveAspectRatio='xMidYMid' style='background: none;')
          g(transform='rotate(0 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.875s' repeatCount='indefinite')
          g(transform='rotate(45 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.75s' repeatCount='indefinite')
          g(transform='rotate(90 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.625s' repeatCount='indefinite')
          g(transform='rotate(135 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.5s' repeatCount='indefinite')
          g(transform='rotate(180 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.375s' repeatCount='indefinite')
          g(transform='rotate(225 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.25s' repeatCount='indefinite')
          g(transform='rotate(270 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='-0.125s' repeatCount='indefinite')
          g(transform='rotate(315 50 50)')
            rect(x='47' y='24' rx='9.4' ry='4.8' width='6' height='12' fill='#222222')
              animate(attributeName='opacity' values='1;0' times='0;1' dur='1s' begin='0s' repeatCount='indefinite')
      text(v-if='state.stage === 4' x='300' y='300' font-size='50px' text-anchor='middle'
           v-bind:class='[suitClass(state.trump)]') {{ suit(state.trump) }}
      text(x='20' y='80' font-size='25px' fill='#222') North/South: {{ state.scores[0] }}
      text(x='20' y='120' font-size='25px' fill='#222') East/West: {{ state.scores[1] }}
      svg.card(
          v-if='state.stage === 1 || state.stage === 3'
          width='60'
          height='80'
          viewBox='-5 -5 60 80'
          x='220'
          y='260'
          v-bind:class='[suitClass(cardSuit(state.trump_card))]')
        rect(
          width='50'
          height='70'
          fill='#fff'
          stroke='#222'
          rx='10'
          ry='10'
        )
        text(x='25' y='32') {{ value(state.trump_card) }}
        text(x='25' y='60') {{ suit(cardSuit(state.trump_card)) }}
      g(v-if='state.player === state.current_player')
        g(v-if='state.stage === 1')
          svg.button(x='290' y='265' width='100' height='30' @click='bid')
            rect(width='100' height='30' fill='#ddd' rx='5' ry='5')
            text(x='50' y='22' fill='#222' font-size='20px' text-anchor='middle') Bid
          svg.button(x='290' y='305' width='100' height='30' @click='pass')
            rect(width='100' height='30' fill='#ddd' rx='5' ry='5')
            text(x='50' y='22' fill='#222' font-size='20px' text-anchor='middle') Pass
        g(v-if='state.stage === 2')
          text(x='300' y='250' fill='#222' font-size='20px' text-anchor='middle') Propose Trump
          svg.button(v-for='s in 4'
                     :x='proposeX(s)' y='265' width='40' height='40' @click='propose(s - 1)')
            rect(width='40' height='40' fill='#ddd' rx='5' ry='5')
            text(x='20' y='32' fill='#222' font-size='40px' text-anchor='middle'
                 v-bind:class='[suitClass(s - 1)]') {{ suit(s - 1) }}
          svg.button(x='250' y='325' width='100' height='30' @click='pass')
            rect(width='100' height='30' fill='#ddd' rx='5' ry='5')
            text(x='50' y='22' fill='#222' font-size='20px' text-anchor='middle') Pass
      svg(
        width='600'
        height='120'
        x='0'
        y='610'
      )
        rect(
          x='125'
          y='10'
          width='350'
          height='100'
          fill='#fff'
          stroke='#222'
          rx='10'
          ry='10'
        )
        svg.card(v-for='(card, i) in state.hand'
            width='60'
            height='80'
            viewBox='-5 -5 60 80'
            :x='handX(i, state.hand.length)'
            y='20'
            v-bind:class='["clickable", suitClass(cardSuit(card))]'
            @click='click(i)')
          rect(
            width='50'
            height='70'
            fill='#fff'
            stroke='#222'
            rx='10'
            ry='10'
          )
          text(x='25' y='32') {{ value(card) }}
          text(x='25' y='60') {{ suit(cardSuit(card)) }}
</template>

<script>
export default {
  props: ['state', 'players', 'onaction'],
  methods: {
    seatX(player) {
      return (player < 3 ? 200 : 0) + (player === 1 ? 200 : 0);
    },
    seatY(player) {
      return (player > 0 ? 200 : 0) + (player === 2 ? 200 : 0);
    },
    handX(i, handsize) {
      return (i * 60) + (300 - (handsize * 30));
    },
    trickX(i) {
      return 20 + (i * 30);
    },
    trickY(i) {
      return 55 + (i * 20);
    },
    proposeX(s) {
      return (50 * s) + 155;
    },
    cardSuit(card) {
      return Math.floor(card / 13);
    },
    suitClass(suit) {
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
    username(player_id) {
      const player = this.players.find(p => p.player_id === player_id);
      return player && player.username;
    },
  },
};
</script>

<style scoped>
.fill {
  width: 100%;
  height: auto;
  max-height: 800px;
}
svg.card {
  font-size: 30px;
  cursor: default;
}
svg.card text {
  text-anchor: middle;
}
svg.button {
  cursor: pointer;
}
.clickable {
  cursor: pointer !important;
}
.spades, .clubs {
  fill: #000;
}
.hearts, .diams {
  fill: #f00;
}
</style>
