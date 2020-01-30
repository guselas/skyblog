<template>
  <div id="app">
    <h3 id="appTitle">Comics Blog</h3>
    <h3 v-if="user">Welcome {{ user }}</h3>
    <div id="nav-menu">
      <b-button
        v-if="isAdmin"
        v-b-popover.hover.top="'BadWords'"
        variant="info"
      >
        <router-link to="/badwordsmanager"
          ><img src="./components/assets/MenuIcons/Badwords.png"
        /></router-link>
      </b-button>

      <b-button v-b-popover.hover.top="'Home'" variant="info">
        <router-link to="/"
          ><img src="./components/assets/MenuIcons/Home.png"
        /></router-link>
      </b-button>

      <b-button
        v-b-popover.hover.top="'My posts'"
        v-if="isAuthenticated"
        variant="info"
      >
        <router-link to="/myposts"
          ><img src="./components/assets/MenuIcons/Details.png"
        /></router-link>
      </b-button>

      <b-button
        v-b-popover.hover.top="'Profile'"
        v-if="isAuthenticated"
        variant="info"
      >
        <router-link to="/profile"
          ><img src="./components/assets/MenuIcons/Profile.png" />
        </router-link>
      </b-button>

      <b-button
        v-b-popover.hover.top="'Log In'"
        v-if="!isAuthenticated"
        variant="info"
      >
        <router-link to="/login"
          ><img src="./components/assets/MenuIcons/logIn.png" />
        </router-link>
      </b-button>

      <b-button
        v-b-popover.hover.top="'Log Out'"
        v-if="isAuthenticated"
        variant="info"
      >
        <router-link to="/logout"
          ><img src="./components/assets/MenuIcons/logOut.png" />
        </router-link>
      </b-button>

      <b-button
        v-b-popover.hover.top="'Register'"
        v-if="!isAuthenticated"
        variant="info"
      >
        <router-link to="/register"
          ><img src="./components/assets/MenuIcons/Register.png" />
        </router-link>
      </b-button>
    </div>
    <router-view />
    <SocialMedia style="  text-align: center;"></SocialMedia>
  </div>
</template>

<script>
import SocialMedia from "./components/SocialMedia";

export default {
  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin;
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated;
    },
    user() {
      return this.$store.getters.nickName;
    }
  },
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

#appTitle {
  font-family: "Rock Salt", cursive;
  color: black;
  font-size: 45pt;
}

h3 {
  text-align: center;
}

#nav-menu {
  padding: 50px;
  text-align: center;
  /* background-color: #6c757d; */
  background-color: #d8e1e1;
}

#nav a {
  font-weight: bold;
  color: white;
}

img {
  height: 45px;
  margin-right: 15px;
}
</style>
