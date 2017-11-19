<template lang='pug'>
  .connect-4
    svg.fill(:viewBox="`-5 -5 ${boardWidth + 10} ${boardHeight + 10}`")
      rect(
        :width='boardWidth'
        :height='boardHeight'
        :rx='circleRadius'
        :ry='circleRadius'
        fill='#5af'
        stroke='#06d'
      )
      g(v-for='(row, r) in state.board')
        circle(
          v-for='(cell, c) in row'
          :cx='circleRadius + (2*circleRadius + circleSpacing)*c + boardPadding'
          :cy='circleRadius + (2*circleRadius + circleSpacing)*r + boardPadding'
          :r='circleRadius'
          :fill='playerColor(cell)'
          stroke='#27c'
        )
</template>
<script>
export default {
  props: ['state'],
  data() {
    return {
      circleRadius: 10,
      circleSpacing: 2,
      boardPadding: 5,
    };
  },
  methods: {
    playerColor(playerId) {
      if (playerId === 0) {
        return '#f66';
      } else if (playerId === 1) {
        return '#ee3';
      }
      return '#fff';
    },
  },
  computed: {
    numRows() { return this.state.board.length; },
    numCols() { return this.state.board[0].length; },
    boardWidth() {
      return (
          (2 * this.circleRadius * this.numCols)
        + (this.circleSpacing * (this.numRows - 1))
        + (2 * this.boardPadding)
      );
    },
    boardHeight() {
      return (
          (2 * this.circleRadius * this.numRows)
        + (this.circleSpacing * (this.numRows - 1))
        + (2 * this.boardPadding)
      );
    },
  },
};
</script>
<style scoped>
.fill {
  width: 100%;
  height: auto;
}
</style>
