<template>
  <div>
    <a id="blogTittle">- COMICS BLOGAZO -</a>
    <nav class="navbar navbar-expand-lg ">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
        <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
          <li class="nav-item active">
            <router-link to="/" class="nav-link">Home</router-link>
          </li>
          <li class="nav-item" v-if="!connected()">
            <router-link to="/register" class="nav-link">Register</router-link>
          </li>
          <li class="nav-item active" v-if="!connected()">
            <router-link to="/login" class="nav-link">Log In</router-link>
          </li>
          <li class="nav-item" v-if="connected()">
            <button @click="logOut" class="nav-link">Log Out</button>
          </li>
        </ul>
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="search" placeholder="Search" />
          <button class="btn btn-outline-success my-2 my-sm-0" type="submit">
            Search
          </button>
        </form>
      </div>
    </nav>
  </div>
</template>

<script>
  export default {
    name: "topMenu",
    methods: {
      logOut: () => {
        delete localStorage.authorization;
        for (let field in localStorage) {
          if (field.indexOf('profile.') == 0) {
            delete localStorage[field];
          }
        }
      },
      connected : ()=>{
        return localStorage["profile.id"];
      }
    },
  };
</script>

<style scoped>
  #nav a {
    color: aliceblue;
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
    color: #6c757d;
  }

  .nav-link {
    font-family: "Bangers", cursive;
    font-size: 50pt;
    margin-right: 35px;
  }
</style>