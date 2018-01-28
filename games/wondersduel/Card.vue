<template lang='pug'>
.card
  .face(v-if='data' v-bind:class='width_dict')
    .header(v-bind:class='header_dict(data)')
      GameSymbol(v-for='effect in data.effects' :key='effect.type' :effect='effect' size='20')
      GameSymbol(v-if='data.chain' symbol='chain' :amt='data.chain' size='20')
    .cost
      GameSymbol(v-for='r in cost(data)' :key='r.r' :symbol='r.r' size='12' :amt='r.amt')
    .cost(v-if='data.chain_cost')
      GameSymbol(symbol='chain' size='12' :amt='data.chain_cost')
    span.title {{ data.name }}
  .space(v-else-if='card === 0') &nbsp;
  .back(v-else v-bind:class='back_dict(age)') &nbsp;
</template>

<script>
import GameSymbol from './GameSymbol';
import rules from './rules';

const resource_list = [null, 'wood', 'clay', 'brick', 'glass', 'paper'];

export default {
  props: ['card', 'wonder', 'age'],
  components: { GameSymbol },
  computed: {
    rules() {
      return rules;
    },
    data() {
      if (this.card && this.card > 0) {
        return rules.cards[this.card];
      } else if (this.wonder) {
        return rules.wonders[this.wonder];
      }
      return null;
    },
    width_dict() {
      return { wonder: this.wonder !== undefined };
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
    header_dict(data) {
      const colour = data.colour;
      return {
        brown: colour === 1,
        grey: colour === 2,
        red: colour === 3,
        green: colour === 4,
        yellow: colour === 5,
        blue: colour === 6,
        purple: colour === 7,
        wondercolour: colour === undefined,
      };
    },
    cost(data) {
      const c = data.cost;
      const rs = [];
      if (c[0] > 0) {
        rs.push({ r: 'coin', amt: c[0] });
      }
      for (let i = 1; i <= 5; i += 1) {
        for (let j = 0; j < c[i]; j += 1) {
          rs.push({ r: resource_list[i] });
        }
      }
      return rs;
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
.card .wonder {
  width: 160px;
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
  width: inherit;
}
.card .space {}
.card .header {
  border: 1px solid black;
  width: inherit;
  height: 30px;
  margin: 0;
  margin-top: -1px;
  margin-left: -1px;
  text-align: center;
}
.card .header .game-symbol {
  display: inline-block;
  margin: 3px;
  width: auto;
  height: 20px;
}
.card .cost {
  padding: 0px 2px;
  height: 15px;
}
.card .cost .game-symbol {
  display: inline-block;
  margin: 1px;
  width: auto;
  height: 15px;
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
.wondercolour {
  background: #F4EA83;
}
</style>
