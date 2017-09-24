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
  color: #222;
  background: #fff;
  font-family: 'Roboto', sans-serif;
}
a {
  color: #08f;
}
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

html, body, #app {
  height: 100%;
  min-height: 100%;
}
</style>
