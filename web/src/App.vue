<template lang='pug'>
  #app
    Spinner(v-if='!reauthenticated')
    .side-bar.panel(v-if='reauthenticated')
      SideBar
    .content.panel(v-if='reauthenticated')
      router-view
</template>

<script>
import Vue from 'vue';
import SideBar from '@/components/SideBar';
import Spinner from '@/components/Spinner';
import globals from '@/globals';
import api from '@/api';

export default {
  components: { SideBar, Spinner },
  mounted() {
    api.post('reauthenticate').then((response) => {
      if (response.success) {
        Vue.set(globals, 'current_user', response.user);
      }
      this.reauthenticated = true;
    });
  },
  data: () => ({
    reauthenticated: false,
  }),
};
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  background: #fff;
}
html, body, #app {
  height: 100%;
  min-height: 100%;
}

/* Input */
body, input, textarea, button, select {
  color: #333;
  font: 16px 'Roboto Condensed', sans-serif;
}
input, textarea, button, select {
  border: 2px solid #999;
  padding: 5px 8px;
  margin: 3px 3px 3px 0;
  outline: 0;
}
select, option {
  padding: 4px 8px;
}
button {
  background: #eee;
}
button:hover {
  background: #f5f5f5;
}
button:active {
  background: #ddd;
}

/* Headers */
h1, h2, h3, h4, h5, h6 {
  font-weight: normal;
  color: #999;
}
h2, h3, h4, h5, h6 {
  margin-top: 0.5em;
}

/* Links */
a {
  color: #08f;
  text-decoration: none;
  outline: none;
  cursor: pointer;
}
a:hover {
  text-decoration: underline;
}
a:active {
  color: #5af;
}

/* Containers */
#app {
  display: flex;
  flex-direction: row;
}
.side-bar {
  width: 200px;
  min-width: 200px;
  height: 100%;
  border-right: 2px solid #aaa;
}
.content {
  flex-grow: 1;
}
.panel {
  padding: 10px;
}

/* Tables */
table {
  padding: 10px;
}
th, td {
  text-align: left;
  padding-right: 20px;
}
tr {
}
th {
  font-weight: normal;
  color: #999;
}

/* Lobbies */
.lobby {
  display: inline-block;
  border: 2px solid #aaa;
  padding: 10px;
  margin: 0 5px 5px 0;
}
.lobby h2 {
  margin: 0;
}
.lobby-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 5px 0;
}
.lobby-section {
  margin: 0px 10px;
}
.lobby-section h2 {
  font-size: 100%;
}
.bignum {
  font-size: 200%;
}
.lobby-type {
  font-size: 130%;
}
.lobby-controls {
  text-align: right;
}
</style>
