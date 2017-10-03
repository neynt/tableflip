<template lang='pug'>
  .login-page
    h1 Sign in
    div(@keydown.13='submit')
      input(type='text' v-model='username' placeholder='Username')
      br
      input(type='password' v-model='password' placeholder='Password')
    button(@click='submit') Sign in
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
      this.error = '';
      api.post('login', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        this.logging_in = false;
        Vue.set(globals, 'current_user', response.user);
        router.push('/');
      }).catch(() => {
        this.error = 'Bad login';
        this.logging_in = false;
      });
    },
  },
};
</script>
<style>
</style>
