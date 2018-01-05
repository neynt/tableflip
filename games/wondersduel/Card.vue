<template lang='pug'>
.card
  .face(v-if='card > 0')
    .header(v-bind:class='header_dict(card)') &nbsp;
    span.title {{ rules.cards[card].name }}
  .space(v-else-if='card === 0') &nbsp;
  .back(v-else v-bind:class='back_dict(age)') &nbsp;
</template>

<script>
import rules from './rules';

export default {
  props: ['card', 'age'],
  computed: {
    rules() {
      return rules;
    },
  },
  methods: {
    back_dict(age) {
      return {
        age1: age === 1,
        age2: age === 2,
        age3: age === 3,
      };
    },
    header_dict(card) {
      const colour = rules.cards[card].colour;
      return {
        brown: colour === 1,
        grey: colour === 2,
        red: colour === 3,
        green: colour === 4,
        yellow: colour === 5,
        blue: colour === 6,
        purple: colour === 7,
      };
    },
  },
};
</script>

<style scoped>
.age1 {
  background: #b3582c;
}
.age2 {
  background: #1787bf;
}
.age3 {
  background: #be94c1;
}
.card {
  display: inline-block;
  vertical-align: top;
  margin: 2px;
}
.card-align {
  width: 40px;
  height: 120px;
}
.card div {
  width: 80px;
  height: 120px;
  word-wrap: break-word;
  position: relative;
  border-radius: 5px;
}
.card .face {
  border: 1px solid black;
  position: relative;
  cursor: pointer;
  background: #fff;
}
.card .back {
  border: 1px solid black;
}
.card .face .title {
  font-size: 12px;
  position: absolute;
  bottom: 5px;
  text-align: center;
  width: 80px;
}
.card .space {}
.card .header {
  border: 1px solid black;
  width: 80px;
  height: 30px;
  margin: 0;
  margin-top: -1px;
  margin-left: -1px;
}
.brown {
  background: #703421;
}
.grey {
  background: #7a7a7a;
}
.red {
  background: #b1392c;
}
.green {
  background: #339449;
}
.yellow {
  background: #f5be48;
}
.blue {
  background: #287ca5;
}
.purple {
  background: #74568c;
}
</style>
