<template lang='pug'>
  .loveletter-game
    h2 {{ latest_message }}
    .players
      .player(v-for='(hand, p_id) in state.hands')
        h2(:class='{ accent: p_id === state.current_player }')
          | {{ username(p_id) }}
          span(v-if='p_id === state.player_id')  (you)
          button(
            v-if='needs_target'
            style='float: right'
            @click='pickTarget(p_id)'
          )
            span(v-if='p_id === target' style='font-weight: bold') Target
            span(v-else) Target

        .gems
          span(v-for='_ in Array(state.num_wins[p_id])') ⋄
          | &nbsp;

        .hand-dead(v-if='!state.player_alive[p_id]')
          | Out of this round

        .cards
          .card.card-active(
            v-for='(card, i) in hand'
            v-if='card'
            :class='{ "card-picked": p_id === state.player_id && i === card_idx }'
            @click='pickCard(card, i)'
          )
            | {{ card }}
          .card.card-hidden(v-else)
          |  
          .card.card-discarded(v-for='card in state.discards[p_id]') {{ card }}

        .guess(v-if='p_id === target && needs_guess')
          h2 Guess
          button(v-for='c in [2, 3, 4, 5, 6, 7, 8]' @click='pickGuess(c)')
            span(v-if='c === card' style='font-weight: bold') {{ c }}
            span(v-else) {{ c }}

        // fully trust the server to do the right thing
        button(
          v-if='state.current_player === state.player_id && p_id === state.priested_player'
          @click='submitMove()'
        ) Continue

</template>
<script>
export default {
  props: ['state', 'players', 'onaction'],
  data() {
    return {
      card_idx: null, // For proper display in case player has two of the same card
      card: null,
      needs_target: false,
      needs_guess: false,
      target: null,
      guess: null,
    };
  },
  computed: {
    latest_message() {
      let message = this.state.log[this.state.log.length - 1];
      for (let i = 0; i < this.state.num_players; i += 1) {
        message = message.replace(`Player ${i}`, this.username(i));
      }
      return message;
    },
  },
  methods: {
    username(player_id) {
      const player = this.players.find(p => p.player_id === player_id);
      return player && player.username;
    },
    submitMove() {
      const action = { card: this.card };
      if (this.needs_target) action.target = this.target;
      if (this.needs_guess) action.guess = this.guess;
      this.onaction(action);
      this.card_idx = null;
      this.card = null;
      this.needs_target = false;
      this.needs_guess = false;
      this.target = null;
      this.guess = null;
    },
    checkForMoveDone() {
      this.needs_target = [1, 2, 3, 5, 6].includes(this.card);
      this.needs_guess = this.card === 1;
      if (this.needs_target && this.target == null) return;
      if (this.needs_guess && this.guess == null) return;
      this.submitMove();
    },
    pickTarget(pid) {
      this.target = pid;
      this.checkForMoveDone();
    },
    pickGuess(card) {
      this.guess = card;
      this.checkForMoveDone();
    },
    pickCard(card, card_idx) {
      if (this.state.player_id !== this.state.current_player) return;
      this.card = card;
      this.card_idx = card_idx;
      this.checkForMoveDone();
    },
  },
};
</script>
<style scoped>
.players {
  /* display: flex; */
  /* flex-wrap: wrap; */
}
.player {
  display: block;
  margin: 10px;
  padding: 10px;
  min-width: 160px;
  border: 2px solid #aaa;
  border-radius: 2px;
}
h2 {
  margin: 0 0 0.2em;
  padding: 0;
}
.cards {
  display: flex;
  flex-wrap: wrap;
}
.hand-dead {
  font-weight: bold;
}
.card {
  display: inline-block;
  width: 50px;
  height: 80px;
  margin: 0 2px 2px 0;
  border: 2px solid #666;
  border-radius: 2px;
  font-size: 36px;
  text-align: center;
}
.card-active {
  cursor: pointer;
}
.card-active:hover {
  background: #eee;
}
.card-picked {
  background: #fcc;
}
.card-picked:hover {
  background: #fcc;
}
.card-hidden {
}
.card-discarded {
  background: #ddd;
}
</style>
