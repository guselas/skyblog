<template>
  <div id="app">
    <div id="nav">
      <TopMenu />
    </div>
    <router-view />
    <SocialMedia />
  </div>
</template>

<script>
import TopMenu from "../src/components/TopMenu";
import SocialMedia from "../src/components/SocialMedia";

export default {
  components: {
    TopMenu,
    SocialMedia
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
