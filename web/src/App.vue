<template lang='pug'>
  #app
    .side-bar.panel(v-if='reauthenticated')
      SideBar
    .content.panel(v-if='reauthenticated')
      router-view
</template>

<script>
import Vue from 'vue';
import SideBar from '@/components/SideBar';
import globals from '@/globals';
import api from '@/api';

export default {
  components: { SideBar },
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
body, input, textarea, button {
  color: #333;
  font: 16px 'Roboto Condensed', sans-serif;
}
input, textarea, button {
  border: 2px solid #999;
  padding: 5px 8px;
  margin: 3px 0;
}
button {
  background: #eee;
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
</style>
