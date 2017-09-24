<template lang='pug'>
  .connect-4
    h1 This will eventually be a Connect 4 board.
    .board
      .row(v-for="row in board")
        .cell(
          :class="{ player0: cell == 0, player1: cell == 1 }"
          v-for="cell in row"
        )
</template>
<script>
export default {
  data: () => ({
    // TODO: Retrieve this data from an API
    board: [
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1, -1],
      [-1, -1, -1, 1, -1, -1, -1],
      [-1, 1, -1, 0, 1, -1, -1],
      [-1, 0, 0, 1, 0, 1, 0],
    ],
    current_player: 1,
    winner: -1,
  }),
};
</script>
<style scoped>
.connect-4 {
  color: red;
}
.board {
  display: inline-block;
  background: #5af;
  padding: 10px;
  border-radius: 15px;
  border: 2px solid rgba(45, 90, 135, 0.8);
}
.row {
  display: block;
}
.cell {
  display: inline-block;
  background: #fff;
  width: 50px;
  height: 50px;
  border-radius: 25px;
  border: 2px solid rgba(45, 90, 135, 0.8);
  margin: 0px 5px;
}
.player0 {
  background: #f46 !important;
}
.player1 {
  background: #ee3 !important;
}
</style>
