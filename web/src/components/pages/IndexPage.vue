<template lang='pug'>
  .main-page
    .main-content
      p Welcome to Tableflip — Board Game Server.
      p (╯°□°)╯︵ ┻━┻
      h2 Lobbies
      Spinner(v-if="lobbies === undefined")
      div(v-if="lobbies")
        table
          tr
            td Type
            td Players
            td Min Players
            td Max Players
          tr(v-for="lobby in lobbies")
            td {{ lobby.type }}
            td {{ lobby.players.length }}
            td {{ lobby.min_players }}
            td {{ lobby.max_players }}
</template>
<script>
import Spinner from '@/components/Spinner';
import api from '@/api';

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
