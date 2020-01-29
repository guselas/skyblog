<template>
  <div id="app">
    <a id="blogTittle">- COMICS BLOGAZO -</a>
    <div id="nav">
      <div class="card cardMain">
        <div class="card-header">
          <TopMenu :profile="profile" />
        </div>
        <div class="card-body">
          <router-view />
        </div>
      </div>
    </div>
    <div class="appBottom container-fluid">
      <SocialMedia />
    </div>
  </div>
</template>

<script>
import TopMenu from "../src/components/TopMenu";
import SocialMedia from "../src/components/SocialMedia";

export default {
  el: "#app",
  data() {
    return {
      profile: {
        email: '',
        nickName: '',
        userId: '',
        isAuthor: false,
        isAdmin: false
      }
    };
  },
    created() {
    this.profile.email = localStorage['profile.email'];
    this.profile.nickName = localStorage['profile.nickName'];
    this.profile.userId = localStorage['profile.id'];
    this.profile.isAuthor = localStorage['profile.isAuthor'];
    this.profile.isAdmin = localStorage['profile.isAdmin'];
  },
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
  color: white;
}

body {
  background: rgba(62, 191, 55, 1);
  background: -moz-linear-gradient(
    -45deg,
    rgba(62, 191, 55, 1) 0%,
    rgba(27, 163, 27, 1) 100%
  );
  background: -webkit-gradient(
    left top,
    right bottom,
    color-stop(0%, rgba(62, 191, 55, 1)),
    color-stop(100%, rgba(27, 163, 27, 1))
  );
  background: -webkit-linear-gradient(
    -45deg,
    rgba(62, 191, 55, 1) 0%,
    rgba(27, 163, 27, 1) 100%
  );
  background: -o-linear-gradient(
    -45deg,
    rgba(62, 191, 55, 1) 0%,
    rgba(27, 163, 27, 1) 100%
  );
  background: -ms-linear-gradient(
    -45deg,
    rgba(62, 191, 55, 1) 0%,
    rgba(27, 163, 27, 1) 100%
  );
  background: linear-gradient(
    135deg,
    rgba(62, 191, 55, 1) 0%,
    rgba(27, 163, 27, 1) 100%
  );
  filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3ebf37', endColorstr='#1ba31b', GradientType=1);
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: white;
}

#blogTittle {
  color: white;
  align-self: auto;
  font-family: "Rock Salt", cursive;
  font-weight: bold;
  font-size: 20pt;
  text-shadow: rgb(59, 59, 59) -1px 1px, rgb(95, 95, 95) -2px 2px,
    rgb(97, 97, 97) -3px 3px, rgb(97, 97, 97) -4px 4px, rgb(97, 97, 97) -5px 5px;
  letter-spacing: 1px;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

.appBottom {
  height: 43px;
  position: fixed;
  bottom: 0;
  background-color: rgba(62, 191, 55, 1);
}

.cardMain {
  border-color: rgba(62, 191, 55, 1);
}
</style>
