<template>
  <div class="connect-4">
    <h1>This will eventually be a Connect 4 board</h1>
    <div class="board">
      <div class="row" v-for="row in board">
        <div class="cell"
          :class="{ player1: cell == 1, player2: cell == 2 }"
          v-for="cell in row">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data: () => ({
    // TODO: Retrieve this data from an API
    board: [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 2, 0, 0, 0],
      [0, 2, 0, 1, 2, 0, 0],
      [0, 1, 1, 2, 1, 2, 1],
    ],
    current_player: 2,
    winner: 0,
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
.player1 {
  background: #f46 !important;
}
.player2 {
  background: #ee3 !important;
}
</style>
