<template lang='pug'>
  .main-page
    .main-content(v-if='globals.current_user')
      h1 This will eventually be a dashboard
    .main-content(v-else)
      h1 Welcome to Tableflip — Board Game Server.
      h1 (╯°□°)╯︵ ┻━┻
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';
import globals from '@/globals';

export default {
  components: { Spinner },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  data: () => ({
    lobbies: undefined,
    globals,
  }),
  methods: {
    fetchData() {
      this.lobbies = undefined;
      api.get('lobbies').then((data) => {
        this.lobbies = data;
      });
    },
  },
};
</script>
<style>
.main-page {
  height: 100%;
  min-height: 100%;
}
.main-content {
}
</style>
