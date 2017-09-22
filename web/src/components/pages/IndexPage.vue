<template>
  <div class="main-page">
    Hello wurld
    <router-link :to="{ name: 'LoginPage' }">Sign in</router-link>
    <router-link :to="{ name: 'GamePage', params: { id: 1 } }">Game 1</router-link>
  </div>
</template>
<script>
export default {};
</script>
<style>
</style>
