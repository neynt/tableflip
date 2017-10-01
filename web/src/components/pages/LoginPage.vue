<template lang='pug'>
  .login-page
    h1 Sign in
    div(@keydown.13='submit')
      input(type='text' v-model='username' name='username' placeholder='Username')
      br
      input(type='password' v-model='password' name='password' placeholder='Password')
      p {{ error }}
    button(@click='submit') Sign in
</template>
<script>
import Vue from 'vue';
import api from '@/api';
import globals from '@/globals';
import router from '@/router';

export default {
  data: () => ({
    error: null,
    globals,
  }),
  methods: {
    submit() {
      api.post('login', {
        username: this.username,
        password: this.password,
      }).then((response) => {
        Vue.set(globals, 'current_user', response.user);
        router.push('/');
      }).catch(() => {
        this.error = 'Bad login';
      });
    },
  },
};
</script>
<style>
</style>
