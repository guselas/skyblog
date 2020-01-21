<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
      aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarTogglerDemo02">
      <ul class="navbar-nav mr-auto mt-2 mt-lg-0">
        <li class="nav-item active">
          <router-link to="/"  class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/register"  class="nav-link">Register</router-link>
        </li>
        <li class="nav-item active">
          <router-link to="/login"  class="nav-link">Log In</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/logout"  class="nav-link">Log Out</router-link>
        </li>
        <li>
          <span id="blogTittle">SKYBLOG</span>
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
</template>

<script>
  export default {
    name: "topMenu",
    props: {}
  };
</script>

<style scoped>
#nav a {
  color: aliceblue;
}

#blogTittle{
  color: red;
  align-self: auto;
}
</style>