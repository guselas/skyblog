<template>
  <div id="app">
    <h3>Comics Blog</h3>
    <div id="nav">
      <router-link to="/"
        ><img src="./components/assets/MenuIcons/Home.png"
      /></router-link>
      |
      <router-link to="/postdetail"
        ><img src="./components/assets/MenuIcons/Details.png"
      /></router-link>
      |
      <router-link to="/profile"
        ><img src="./components/assets/MenuIcons/Profile.png"
      /></router-link>
      |
      <router-link to="/login"
        ><img src="./components/assets/MenuIcons/logIn.png"
      /></router-link>
      | <a><img src="./components/assets/MenuIcons/logOut.png"/></a> |
      <router-link to="/register"
        ><img src="./components/assets/MenuIcons/Register.png"
      /></router-link>
    </div>
    <router-view />
    <SocialMedia style="  text-align: center;"></SocialMedia>
  </div>
</template>

<script>
import SocialMedia from "./components/SocialMedia";

export default {
  components: {
    SocialMedia
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
}

h3 {
  text-align: center;
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

img {
  height: 25px;
}
</style>
