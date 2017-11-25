<template lang='pug'>
  .loveletter-game
    h2 {{ latest_message }}
    .players
      .player(v-for='(hand, p_id) in state.hands')
        h2(:class='{ accent: p_id === state.current_player, \
            "active-player": p_id === state.current_player }')
          | {{ username(p_id) }}
          span(v-if='p_id === state.player_id')  (you)
          button(
            v-if='can_target(p_id)'
            style='float: right'
            @click='pickTarget(p_id)'
          )
            span(:style='{ fontWeight: (p_id === target) ? "bold" : "normal" }') Target

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
      button(
        v-if='no_valid_target'
        style='float: right'
        @click='pickTarget(-1)'
      )
        span(:style='{ fontWeight: (-1 === target) ? "bold" : "normal" }') No target

</template>
<script>
import rules from './rules';

export default {
  props: ['state', 'players', 'onaction'],
  data() {
    return {
      card_idx: null, // For proper display in case player has two of the same card
      card: null,
      needs_target: false,
      needs_guess: false,
      can_target_self: false,
      target: null,
      guess: null,
      rules,
    };
  },
  computed: {
    latest_message() {
      let message = this.state.log[this.state.log.length - 1];
      for (let i = 0; i < this.state.num_players; i += 1) {
        message = message.replace(new RegExp(`Player ${i}`, 'g'), this.username(i));
      }
      return message;
    },
    no_valid_target() {
      if (!this.needs_target) return false;
      let result = true;
      for (let p_id = 0; p_id < this.state.num_players; p_id += 1) {
        if (this.can_target(p_id)) {
          result = false;
        }
      }
      return result;
    },
  },
  methods: {
    username(player_id) {
      const player = this.players.find(p => p.player_id === player_id);
      return player && player.username;
    },
    can_target(p_id) {
      return (
        this.needs_target &&
        (p_id !== this.state.player_id || this.can_target_self) &&
        !rules.is_handmaided(this.state, p_id)
      );
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
      this.can_target_self = this.card === 5;
      this.needs_guess = this.card === 1;
      if (this.needs_target && this.target == null) return;
      if (this.needs_guess && this.guess == null && this.target !== -1) return;
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
      this.target = null;
      this.guess = null;
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
.active-player::before {
  content: '⇒ ';
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
