<template lang='pug'>
  .connect-4
    .board
      .col(
        v-for='(_, c) in state.board[0]'
        @click='click(c)'
      )
      .row(v-for='row in state.board')
        .cell(
          v-for='(cell, c) in row'
          :class='{ \
            player0: cell === 0, \
            player1: cell === 1, \
          }'
        )
    .cur_player(v-if='state.winner == -1')
      | Current player is
      br
      .cell(
        :class='{ \
          player0: state.current_player === 0, \
          player1: state.current_player === 1, \
        }'
      )
      br
      | You are
      br
      .cell(
        :class='{ \
          player0: state.player === 0, \
          player1: state.player === 1, \
        }'
      )
    .winner(v-if='state.winner != -1')
      | Winner is
      br
      .cell(
        :class='{ \
          player0: state.winner === 0, \
          player1: state.winner === 1, \
        }'
      )
</template>
<script>
export default {
  props: ['state', 'onaction'],
  methods: {
    click(c) {
      this.onaction({
        player: this.state.current_player,
        column: c,
      });
    },
  },
};
</script>
<style scoped>
.board {
  display: inline-block;
  background: #5af;
  padding: 10px;
  border-radius: 15px;
  border: 2px solid rgba(45, 90, 135, 0.8);
  white-space: nowrap;
}
.col {
  border-top: 5px solid rgba(0, 0, 0, 0.5);
  position: relative;
  display: inline-block;
  background: rgba(0, 0, 0, 0.0);
  width: 54px;
  height: 340px;
  border-radius: 2px;
  margin: -10px 3px -330px;
  z-index: 1;
}
.col:hover {
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}
.row {
  display: block;
}
.cell {
  position: relative;
  display: inline-block;
  background: #fff;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 2px solid rgba(45, 90, 135, 0.8);
  margin: 0px 5px;
}
.hover {
  background: #ccc !important;
}
.player0 {
  background: #f46 !important;
}
.player1 {
  background: #ee3 !important;
}
</style>
