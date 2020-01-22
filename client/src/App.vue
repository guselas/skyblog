<template>
  <div id="app">
    <div id="nav">
      <div class="card">
        <div class="card-header">
          <TopMenu />
        </div>
        <div class="card-body">
          <router-view />
        </div>
        <div class="card-footer"></div>
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
  color: #2c3e50;
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
</style>
