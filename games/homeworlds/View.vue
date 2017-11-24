<template lang='pug'>
  .homeworlds
    svg.legend(:width='legendWidth()' :viewBox='"0 0 " + legendWidth() + " 100"')
      g(v-for='player in state.players')
        g(:transform='"translate(" + shipX(player - 2) + ",0)"')
          use(xlink:href='#large' :fill='pyramidColour(3 * (player - 1))' width='60' height='60'
              :transform='"rotate(" + shipAngle(12 * (player - 1)) + " 30 30)"')
        text(:x='shipX(player - 2) + 30' y='75' text-anchor='middle') {{ username(player - 1) }}
        g(v-if='player - 1 === state.current_player')
          <svg :x='shipX(player - 2) + 20' y='80' width="20px" height="20px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" style="background: none;"><g transform="rotate(0 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.8333333333333334s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(60 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.6666666666666666s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(120 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.5s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(180 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.3333333333333333s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(240 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="-0.16666666666666666s" repeatCount="indefinite"></animate>
            </rect>
          </g><g transform="rotate(300 50 50)">
            <rect x="45" y="10" rx="4.5" ry="1" width="10" height="40" fill="#a9a9a9">
              <animate attributeName="opacity" values="1;0" times="0;1" dur="1s" begin="0s" repeatCount="indefinite"></animate>
            </rect>
          </g></svg>
    br
    svg.stash(width='720' viewBox='0 0 720 100')
      defs
        symbol(id='large' viewBox='0 0 60 60')
          polygon(points='14,58 30,2 46,58' stroke='#000' strokeWidth='1')
          rect(x='28' y='50' width='4' height='4' fill='#000')
          rect(x='20' y='50' width='4' height='4' fill='#000')
          rect(x='36' y='50' width='4' height='4' fill='#000')
        symbol(id='medium' viewBox='0 0 60 60')
          polygon(points='17.5,52 30,8 42.5,52' stroke='#000' strokeWidth='1')
          rect(x='24' y='44' width='4' height='4' fill='#000')
          rect(x='32' y='44' width='4' height='4' fill='#000')
        symbol(id='small' viewBox='0 0 60 60')
          polygon(points='21,46 30,14 39,46' stroke='#000' strokeWidth='1')
          rect(x='28' y='38' width='4' height='4' fill='#000')
      g(v-for='(count, pyramid) in stash()')
        g(v-if='count > 0')
          rect.clickable(@click='clickStash(pyramid)'
              :x='stashX(pyramid) + 10' y='5' width='40' height='90' fill='#fff')
          rect.clickable(@click='clickStash(pyramid)'
              :x='stashX(pyramid) + 10' y='5' width='40' height='90' fill='#fff' stroke='#000'
              v-if='selectedStash === pyramid' stroke-dasharray='5,5')
            animate(attributeName='stroke-dashoffset' values='0;-10' dur='0.3s'
                    repeatCount='indefinite')
          g(v-for='i in count'
            :transform='"translate(" + stashX(pyramid) + "," + stashY(pyramid, i - 1) + ")"')
            use.clickable(@click='clickStash(pyramid)'
                :xlink:href='pyramidSize(pyramid)' :fill='pyramidColour(pyramid)'
                width='60' height='60'
            )
    hr
    svg.system(v-for='(system, id) in systems()'
               :viewBox='"0 0 " + systemWidth(system) + " 100"'
               :width='systemWidth(system)')
      rect(x='5' y='5' :width='systemWidth(system) - 10' height='90' fill='#fff' stroke='#000')
      rect.clickable(@click='clickSystem(id)'
          x='10' y='10' width='40' height='80' fill='#fff' stroke='#000')
        animate(v-if='selectedSystem === id' attributeName='stroke-dasharray' values='5,5')
        animate(attributeName='stroke-dashoffset' values='0;-10' dur='0.3s'
                repeatCount='indefinite')
      g(v-for='(pyramid, i) in sortedStars(system.stars)')
        g(:transform='"translate(0," + stackY(i, sortedStars(system.stars)) + ")"')
          use.clickable(@click='clickSystem(id)'
              :xlink:href='pyramidSize(pyramid)' :fill='pyramidColour(pyramid)'
              width='60' height='60' transform='rotate(0 30 30)')
      g(v-for='(ship, i) in system.ships')
        g(:transform='"translate(" + shipX(i) + ",25)"')
          rect.clickable(@click='clickShip(id, i)' width='60' height='60' fill='#fff')
          rect.clickable(@click='clickShip(id, i)'
              width='60' height='60' fill='#fff' stroke='#000'
              v-if='selectedShip === i && selectedShipSys === id' stroke-dasharray='5,5')
            animate(attributeName='stroke-dashoffset' values='0;-10' dur='0.3s'
                    repeatCount='indefinite')
          use.clickable(@click='clickShip(id, i)'
              :xlink:href='pyramidSize(ship)' :fill='pyramidColour(ship)'
              width='60' height='60' :transform='"rotate(" + shipAngle(ship) + " 30 30)"')
    hr
    button(v-for='action in possibleActions()' @click='doAction(action)') {{ actionName(action.type) }}
    button(v-if='selectedStash !== null || selectedSystem !== null || selectedShip !== null || homeworldParts.length' @click='cancel') Cancel
</template>

<script>
import rules from './rules';

export default {
  props: ['state', 'players', 'onaction'],
  data() {
    return {
      selectedStash: null,
      selectedSystem: null,
      selectedShip: null,
      selectedShipSys: null,
      homeworldParts: [],
    };
  },
  methods: {
    stash() {
      const stash = this.state.stash.slice();
      for (let i = 0; i < this.homeworldParts.length; i += 1) {
        stash[this.homeworldParts[i]] -= 1;
      }
      return stash;
    },
    systems() {
      const systems = this.state.systems;
      if (this.homeworldParts.length) {
        systems[this.state.next_system] = {
          stars: this.homeworldParts.slice(0, 2),
          ships: [this.homeworldParts[2] + (12 * this.state.player)],
        };
      } else {
        delete systems[this.state.next_system];
      }
      return systems;
    },
    pyramidSize(pyramid) {
      return ['#small', '#medium', '#large'][pyramid % 3];
    },
    pyramidColour(pyramid) {
      return ['#f00', '#ff0', '#2a2', '#22f'][Math.floor(pyramid / 3) % 4];
    },
    stashX(pyramid) {
      return pyramid * 40;
    },
    stashY(pyramid, i) {
      return 40 - (i * 10) - ((pyramid % 3) * 6);
    },
    systemWidth(system) {
      return 10 + (60 * (system.ships.length + 1));
    },
    shipX(i) {
      return 60 + (i * 60);
    },
    legendWidth() {
      return this.state.players * 60;
    },
    shipAngle(ship) {
      return Math.floor(ship / 12) * (360 / this.state.players);
    },
    stackY(i_, stack_) {
      function inner(i, stack) {
        if (i === 0) {
          return 40 - ((stack[i] % 3) * 6);
        }
        return ((inner(i - 1, stack) + ((stack[i] % 3) * 6)) - 10) - ((stack[i - 1] % 3) * 6);
      }
      return inner(i_, stack_);
    },
    sortedStars(stars) {
      return stars.slice().sort((x, y) => (((y % 3) * 100) - ((x % 3) * 100)) + (y - x));
    },
    possibleActions() {
      const ship = this.selectedShip !== null
        ? this.state.systems[this.selectedShipSys].ships[this.selectedShip]
        : null;
      const system = this.selectedSystem && parseInt(this.selectedSystem, 10);
      const shipSys = this.selectedShipSys && parseInt(this.selectedShipSys, 10);
      const bits = (this.selectedStash !== null ? 4 : 0) +
                   (this.selectedSystem !== null ? 2 : 0) +
                   (this.selectedShip !== null ? 1 : 0);
      const actions = [];
      if (bits === 0) {
        actions.push({ type: 0 });
      } else if (bits === 1) {
        actions.push({ type: 1, system: shipSys, target: ship });
        actions.push({ type: 6, system: shipSys, ship });
        actions.push({
          type: 7,
          system: shipSys,
          target: Math.floor(ship / 3) % 4,
        });
      } else if (bits === 3) {
        actions.push({
          type: 3,
          system: shipSys,
          ship,
          target: system,
        });
      } else if (bits === 5) {
        actions.push({
          type: 2,
          system: shipSys,
          ship,
          target: this.selectedStash,
        });
        actions.push({
          type: 5,
          system: shipSys,
          ship,
          target: Math.floor(this.selectedStash / 3) % 4,
        });
      } else if (bits === 6) {
        actions.push({
          type: 4,
          system,
          target: Math.floor(this.selectedStash / 3) % 4,
        });
      }
      if (this.homeworldParts.length === 3) {
        actions.push({
          type: 8,
          stars: this.homeworldParts.slice(0, 2),
          ship: this.homeworldParts[2],
        });
      }
      return actions.filter(action => rules.is_action_legal(this.state, action));
    },
    actionName(type) {
      return ['Pass', 'Attack', 'Discover', 'Travel', 'Build', 'Trade',
              'Sacrifice', 'Catastrophe', 'Build Homeworld'][type];
    },
    username(player_id) {
      const player = this.players.find(p => p.player_id === player_id);
      return player && player.username;
    },
    clickStash(pyramid) {
      if (this.state.next_system === this.state.player) {
        if (this.homeworldParts.length < 3) {
          this.homeworldParts.push(pyramid);
        }
      } else if (this.selectedStash === pyramid) {
          this.selectedStash = null;
      } else if (this.state.current_player === this.state.player && this.stash()[pyramid] > 0) {
        this.selectedStash = pyramid;
      }
    },
    clickShip(system, ship) {
      if (this.selectedShip === ship && this.selectedShipSys === system) {
        this.selectedShip = null;
        this.selectedShipSys = null;
      } else if (this.state.current_player === this.state.player) {
        this.selectedShip = ship;
        this.selectedShipSys = system;
      }
    },
    clickSystem(system) {
      if (this.selectedSystem === system) {
        this.selectedSystem = null;
      } else if (this.state.current_player === this.state.player) {
        this.selectedSystem = system;
      }
    },
    cancel() {
      this.selectedStash = null;
      this.selectedSystem = null;
      this.selectedShip = null;
      this.selectedShipSys = null;
      this.homeworldParts = [];
    },
    doAction(action) {
      this.onaction(action);
      this.cancel();
    },
  },
};
</script>
<style scoped>
.clickable {
  cursor: pointer;
}
svg.system {
  display: inline-block;
}
</style>
