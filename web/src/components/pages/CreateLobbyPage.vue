<template lang='pug'>
  .lobby-page
    h1 Create lobby
    .lobby-detail
      select
        option(value='connect4') Connect 4
        option(value='wow') World of Warcraft
        option(value='rs') Runescape
        option(value='lol') League of Legends
      //.lobby-row
        .lobby-section
          h2 Required players
          // TODO: Make this work
      button(@click='create') Create
</template>
<script>
import Spinner from '@/components/Spinner';

export default {
  components: { Spinner },
  computed: {
    lobby_id() {
      return this.route.params.id;
    },
  },
  data: () => ({
    lobbies: undefined,
    current_lobby: undefined,
  }),
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    create() {
    },
  },
};
</script>
<style>
</style>
