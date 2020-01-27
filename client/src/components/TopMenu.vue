<template>
  <div>
    <p>{{ profile.email}} || {{ profile.nickName}}</p>
    <nav class="navbar navbar-expand-lg ">
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link :to="{ name: 'Home' }">
              <button class="nav-link">Home</button>
            </router-link>
          </li>

          <li class="nav-item" v-if="!islogged">
            <router-link :to="{ name: 'Home' }">
              <button class="nav-link">Register</button>
            </router-link>
          </li>

          <li class="nav-item active" v-if="!islogged">
            <router-link :to="{ name: 'Login' }">
              <button @click="login" class="nav-link">Log In</button>
            </router-link>
          </li>

          <li class="nav-item" v-if="islogged">
            <router-link :to="{ name: 'Home' }">
              <button @click="logOut" class="nav-link">Log Out</button>
            </router-link>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="search"
            placeholder="Search"
          />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "topMenu",
  data: function() {
    return {
      localStorage: localStorage,
      islogged: false
    };
  },
  props:['profile'],
  methods: {
    ...mapActions(["postLogin"]),
    ...mapActions(["postLogOut"]),

    login() {
      this.postLogin();
      this.islogged = true;
    },

    logOut() {
      this.islogged = false;
      this.postLogOut();
    },

    connected: () => {
      /* eslint-disable  no-console*/
      console.log("connected() = true if: ", localStorage["profile.id"]);
      /* eslint-disable  no-console*/
      if (localStorage["profile.id"]) {
        return localStorage["profile.id"];
      } else {
        return "not connected";
      }
    }
  }
};
</script>

<style scoped>
#nav a {
  color: aliceblue;
}

#nav a.button-exact-active {
  color: #6c757d;
}

.nav-link {
  font-family: "Bangers", cursive;
  font-size: 50pt;
  margin-right: 35px;
}
</style>
