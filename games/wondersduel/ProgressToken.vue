<template lang='pug'>
.progress-token
  .effects
    GameSymbol(v-for='effect in rules.progress[progress].effects' :key='effect.type' :effect='effect' size='30')
  span.title {{ rules.progress[progress].name }}
</template>

<script>
import GameSymbol from './GameSymbol';
import rules from './rules';

export default {
  props: ['progress'],
  components: { GameSymbol },
  computed: {
    rules() {
      return rules;
    },
  },
};
</script>

<style scoped>
.progress-token {
  display: inline-block;
  width: 90px;
  height: 90px;
  border-radius: 45px;
  background-color: #E4EAC0;
  border: 5px solid #44854F;
  margin: 5px;
  position: relative;
  cursor: pointer;
}
.effects {
  text-align: center;
  position: absolute;
  width: 80px;
  top: 20px;
}
.effects .game-symbol {
  margin: 2px;
}
.title {
  font-size: 12px;
  text-align: center;
  width: 80px;
  position: absolute;
  margin: 0px;
  bottom: 10px;
}
</style>
