<template lang='pug'>
  .register-page
    h1 Register
    div(@keydown.13='submit')
      input(type='text' v-model='username' name='username' placeholder='Username')
      br
      input(type='password' v-model='password' name='password' placeholder='Password')
    button(@click='submit') Register
    .errors {{ error }}
    Spinner(v-if='logging_in')
</template>
<script>
import Vue from 'vue';
import Spinner from '@/components/Spinner';
import api from '@/api';
import globals from '@/globals';
import router from '@/router';

export default {
  components: { Spinner },
  data: () => ({
    globals,
    username: '',
    password: '',
    error: null,
    logging_in: false,
  }),
  methods: {
    submit() {
      this.logging_in = true;
      api.post('register', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        this.logging_in = false;
        Vue.set(globals, 'current_user', response.user);
        globals.fetchGames();
        router.push('/');
      }).catch(() => {
        this.error = 'Bad registration';
        this.logging_in = false;
      });
    },
  },
};
</script>
<style>
</style>
