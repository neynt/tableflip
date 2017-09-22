<template>
  <div class="game-page">
    Game id {{ this.$route.params.id }}.
    <Connect4View />
  </div>
</template>
<script>
import Connect4View from '@/games/connect4/View';

export default {
  components: { Connect4View },
};
</script>
<style>
</style>
