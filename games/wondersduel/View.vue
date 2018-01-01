<template lang='pug'>
  .wondersduel
    h1 This will be 7 Wonders Duel.
    p(v-for='(i, card) in rules.cards') {{ card.name }}
</template>

<script>
import rules from './rules';

export default {
  props: ['state', 'players', 'onaction'],
  data() {
    return {
      rules,
    };
  },
};
</script>

<style scoped>
</style>
