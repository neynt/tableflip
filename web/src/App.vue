<template lang='pug'>
  #app
    .side-bar.panel
      SideBar
    .content.panel
      router-view
</template>

<script>
import SideBar from '@/components/SideBar';

export default {
  components: { SideBar },
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
