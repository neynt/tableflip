<template lang='pug'>
  .game-page
    | Game id {{ this.$route.params.id }}.
    component(:is="game_view")
</template>
<script>
import Connect4View from '@/games/connect4/View';
import api from '@/api';

export default {
  computed: {
    game_view: () => Connect4View,
  },
};
</script>
<style>
</style>
