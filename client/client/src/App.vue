<template>
  <div id="app">
    <Login/>
    <!-- <Register/>
    <SocialMediaLogos/> -->
  </div>
</template>

<script>
//TODO: use veautify
import Login from './components/Login.vue';
// import Register from './components/Register';
// import SocialMediaLogos from './components/SocialMediaLogos';

export default {
  name: 'app',
  components: {
    Login
    // Register,
    // SocialMediaLogos
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: grey;
}
</style>
