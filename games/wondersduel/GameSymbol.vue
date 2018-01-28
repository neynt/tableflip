<template lang='pug'>
.game-symbol
  svg(:viewBox='viewBox' :width='size * widthMultiplier' :height='size')
    defs
      symbol(id='coin')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#E3C54A')
      symbol(id='wood')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#598435')
      symbol(id='clay')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#CF5B32')
      symbol(id='brick')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#82827E')
      symbol(id='glass')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#47C2E1')
      symbol(id='paper')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#E9C890')
      symbol(id='shield')
        circle(cx='50' cy='50' r='50' fill='#000000')
        circle(cx='50' cy='50' r='45' fill='#BD3C33')
        path(d='M10 0L90 100M90 0L10 100' stroke='#DDDDDD' stroke-width='10')
      symbol(id='science')
        circle(cx='50' cy='50' r='50' fill='#B07941')
      symbol(id='victory')
        circle(cx='50' cy='50' r='42' stroke='#73B249' fill='none' stroke-width='16')
        circle(cx='50' cy='50' r='42' stroke='#000000' fill='none' stroke-width='3')
      symbol(id='slash')
        path(d='M45 75L55 25' stroke='#FFFFFF' stroke-width='10')
      symbol(id='browncard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#593E25')
      symbol(id='greycard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#858779')
      symbol(id='browngreycard')
        rect(x='0' y='0' width='60' height='90' rx='10' ry='10' fill='#593E25')
        rect(x='20' y='10' width='60' height='90' rx='10' ry='10' fill='#858779')
      symbol(id='redcard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#D33C37')
      symbol(id='yellowcard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#F9D750')
      symbol(id='greencard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#19923C')
      symbol(id='bluecard')
        rect(x='20' y='0' width='60' height='90' rx='10' ry='10' fill='#1E70B6')
      symbol(id='pyramid')
        path(d='M50 10L90 80L50 90Z' fill='#8D7737')
        path(d='M50 10L10 80L50 90Z' fill='#F4EA83')
        path(d='M50 10L90 80L50 90L10 80Z' stroke='#000000' fill='none' stroke-width='2')
      symbol(id='guild')
        path(d='M30 5l15 30l-30 0Z' fill='#DBDCDB')
        path(d='M70 20L30 80' stroke='#DDDDDD' stroke-width='10')
        path(d='M70 95l15 -30l-30 0Z' fill='#DBDCDB')
      symbol(id='chain')
        rect(x='0' y='0' width='100' height='100' rx='40' ry='40' fill='none' stroke='#000000' stroke-width='5')
      symbol(id='goagain')
        path(
           sodipodi:type="arc"
           style="fill:none;stroke:#ffffff;stroke-width:9.57759285;stroke-miterlimit:4;stroke-opacity:1;stroke-dasharray:106, 30"
           d="m 91.65247,47.359455 a 43.441227,42.759796 0 1 1 -86.8824543,0 43.441227,42.759796 0 1 1 86.8824543,0 z"
           transform="matrix(-0.9322941,0,0,0.94715138,94.947057,0)"
        )
        path(
           style="fill:#ffffff;fill-opacity:1;stroke:none"
           d="m 0,50 10,-20 10,20 z"
           id="path4770"
           inkscape:connector-curvature="0")
        path(
           fill='#FFFFFF'
           d="m 80,40 10,20 10,-20 z")
      symbol(id='destroy')
        path(d='M90 5L10 95' stroke='#000000' stroke-width='10')
      symbol(id='library')
        circle(cx='40' cy='35' r='30' fill='#59AB55' stroke='#44854F' stroke-width='5')
        circle(cx='50' cy='50' r='30' fill='#59AB55' stroke='#44854F' stroke-width='5')
        circle(cx='60' cy='65' r='30' fill='#E4EAC0' stroke='#44854F' stroke-width='5')
      symbol(id='mausoleum')
        rect(x='20' y='5' width='60' height='90' rx='10' ry='10' fill='#858779' stroke='#000000' stroke-width='5')
        path(d='M15 0l40 60m-40 0l40 -60' stroke='#FF0000' stroke-width='5')
    g(v-for='component in components')
      svg(viewBox='0 0 100 100' :x='component.x' :y='component.y' :width='component.size' :height='component.size')
        use(:xlink:href='component.id')
        text(v-if='component.text !== undefined' x='50' y='75' text-anchor='middle') {{ component.text }}
</template>

<script>
const resource_list = [null, 'wood', 'clay', 'brick', 'glass', 'paper'];
const exceptions = {
  56: { symbol: 'greycard', coins: 3 },
  57: { symbol: 'browncard', coins: 2 },
  58: { symbol: 'redcard', coins: 1 },
  59: { symbol: 'yellowcard', coins: 1 },
  60: { symbol: 'pyramid', coins: 2 },
  67: { symbol: 'yellowcard', coins: 1, victory: 1 },
  68: { symbol: 'browngreycard', coins: 1, victory: 1 },
  69: { symbol: 'pyramid', victory: 2 },
  70: { symbol: 'bluecard', coins: 1, victory: 1 },
  71: { symbol: 'greencard', coins: 1, victory: 1 },
  72: { symbol: 'coin', text: 3, victory: 1 },
  73: { symbol: 'redcard', coins: 1, victory: 1 },
};

export default {
  props: ['symbol', 'effect', 'size', 'amt'],
  computed: {
    components() {
      if (this.symbol) {
        return [{
          id: `#${this.symbol}`,
          x: 0,
          y: 0,
          size: 100,
          text: this.amt,
        }];
      } else if (this.effect) {
        const e = this.effect;
        if (e.type === 'resource') {
          return [{
            id: `#${resource_list[e.r]}`,
            x: 0,
            y: 0,
            size: 100,
          }];
        } else if (e.type === 'shields') {
          const l = [];
          for (let i = 0; i < e.amt; i += 1) {
            l.push({
              id: '#shield',
              x: 5 + (i * 100),
              y: 5,
              size: 90,
            });
          }
          return l;
        } else if (e.type === 'science') {
          return [{
            id: '#science',
            x: 0,
            y: 0,
            size: 100,
            text: e.science,
          }];
        } else if (e.type === 'victory') {
          return [{
            id: '#victory',
            x: 0,
            y: 0,
            size: 100,
            text: e.amt,
          }];
        } else if (e.type === 'trade') {
          return [{
            id: `#${resource_list[e.r]}`,
            x: 10,
            y: 10,
            size: 90,
          }, {
            id: '#coin',
            x: 0,
            y: 0,
            size: 50,
            text: '1',
          }];
        } else if (e.type === 'coins') {
          return [{
            id: '#coin',
            x: 0,
            y: 0,
            size: 100,
            text: e.amt,
          }];
        } else if (e.type === 'resource_opt') {
          const l = [];
          for (let i = 0; i < e.rs.length; i += 1) {
            l.push({
              id: `#${resource_list[e.rs[i]]}`,
              x: 10 + (100 * i),
              y: 10,
              size: 80,
            });
            if (i !== 0) {
              l.push({
                id: '#slash',
                x: (100 * i) - 50,
                y: 0,
                size: 100,
              });
            }
          }
          return l;
        } else if (e.type === 'coins_fn' || e.type === 'victory_fn') {
          const ex = exceptions[e.hint];
          if (ex) {
            const amt = e.type === 'coins_fn' ? ex.coins : ex.victory;
            return [{
              id: `#${ex.symbol}`,
              x: 0,
              y: 10,
              size: 90,
              text: ex.text,
            }, {
              id: e.type === 'coins_fn' ? '#coin' : '#victory',
              x: 50,
              y: 50,
              size: 50,
              text: amt,
            }];
          }
        } else if (e.type === 'destroy_resource') {
          return [{
            id: e.colour === 1 ? '#browncard' : '#greycard',
            x: 0,
            y: 0,
            size: 100,
          }, {
            id: '#destroy',
            x: 0,
            y: 0,
            size: 100,
          }];
        } else if (e.type === 'take_coins') {
          return [{
            id: '#coin',
            x: 0,
            y: 0,
            size: 100,
            text: e.amt,
          }, {
            id: '#destroy',
            x: 0,
            y: 0,
            size: 100,
          }];
        } else if (e.type === 'guild' || e.type === 'goagain' ||
                   e.type === 'library' || e.type === 'mausoleum') {
          return [{
            id: `#${e.type}`,
            x: 0,
            y: 0,
            size: 100,
          }];
        }
      }
      return [];
    },
    widthMultiplier() {
      if (this.effect) {
        const e = this.effect;
        if (e.type === 'shields') {
          return e.amt;
        } else if (e.type === 'resource_opt') {
          return e.rs.length;
        }
      }
      return 1;
    },
    viewBox() {
      const width = this.widthMultiplier * 100;
      return `0 0 ${width} 100`;
    },
  },
};
</script>

<style scoped>
text {
  font-size: 75px;
}
</style>
