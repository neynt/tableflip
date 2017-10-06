<template lang='pug'>
  .quarto
    div(v-if='state.winner === -1')
      p(v-if='state.player == state.current_player') Your turn!
      p(v-else) Waiting for player {{ state.current_player }}.
    p(v-else) Game over.
      span(v-if='state.player === state.winner') You won!
      span(v-else-if='state.player !== -1') You lost!
      span(v-else) Player {{ state.winner }} won.
    .board
      .row(v-for='(cells, row) in state.board')
        .cell(
          v-for='(cell, column) in cells'
          @click='play(row, column)'
          :class='{ empty: cell === -1 }'
        )
          .piece(
            v-if='cell != -1'
            :class='{ blue: cell & 0x8, square: cell & 0x4, large: cell & 0x2 }'
          )
            .dot(v-if='cell & 0x1')
    div(v-if='state.given_piece !== -1')
      p Given piece:
        .piece(
          v-if='state.given_piece != -1'
          :class='{ blue: state.given_piece & 0x8, square: state.given_piece & 0x4, large: state.given_piece & 0x2 }'
        )
          .dot(v-if='state.given_piece & 0x1')
    .stash
      .piece(
        v-for='cell in state.pieces'
        :class='{ blue: cell & 0x8, square: cell & 0x4, large: cell & 0x2 }'
        @click='give(cell)'
      )
        .dot(v-if='cell & 0x1')
</template>
<script>
export default {
  props: ['state', 'onaction'],
  methods: {
    play(row, column) {
      this.onaction({
        type: 'play',
        row,
        column,
      });
    },
    give(given_piece) {
      this.onaction({
        type: 'give',
        given_piece,
      });
    },
  },
};
</script>
<style scoped>
.connect-4 {
  color: red;
}
.board {
  display: inline-block;
  background: #fff;
  padding: 5px;
  border-radius: 15px;
  border: 2px solid #000;
}
.stash {
  display: block;
  width: 300px;
}
.row {
  display: block;
  padding: 0;
}
.cell {
  display: inline-block;
  background: #fff;
  width: 75px;
  height: 75px;
  border-radius: 37.5px;
  border: 2px solid black;
  margin: 2px 2px;
  padding: 0;
}
.cell.empty {
  cursor: pointer;
}

/* Piece styles */
.piece {
  background: #f00;
  width: 35px;
  height: 35px;
  margin: 18px;
  padding: 5px;
  border-radius: 17.5px;
  display: inline-block;
}
.stash .piece {
  cursor: pointer;
}
.blue {
  background: #00f;
}
.large {
  width: 50px;
  height: 50px;
  margin: 10.5px;
  padding: 10px;
  border-radius: 25px;
}
.square {
  border-radius: 5px !important;
}
.hollow {
  content: '<div class=\'dot\'></div>'
}
.dot {
  background: rgba(0, 0, 0, 0.5);
  width: 25px;
  height: 25px;
  border-radius: 12.5px;
}
.large .dot {
  width: 30px;
  height: 30px;
  border-radius: 15px;
}
</style>
