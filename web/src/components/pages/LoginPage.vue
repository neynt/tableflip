<template lang='pug'>
  .login-page
    h1 Sign in
    div(@keydown.13='submit')
      input(type='text' name='username' placeholder='Username')
      br
      input(type='password' name='password' placeholder='Password')
    button(@click='submit') Sign in
</template>
<script>
export default {
  methods: {
    submit() {
    },
  },
};
</script>
<style>
</style>
