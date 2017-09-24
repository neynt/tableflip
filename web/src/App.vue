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
  color: #333;
  background: #fff;
  font-family: 'Roboto Condensed', sans-serif;
}
html, body, #app {
  height: 100%;
  min-height: 100%;
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
  width: 20vw;
  max-width: 250px;
  height: 100%;

  border-right: 2px solid #aaa;
}
.panel {
  padding: 10px;
}
</style>
