<template>
  <div>
    <h2>Login</h2>

    <form id="loginForm">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input v-model="input.email" type="email" class="form-control" id="exampleInputEmail1"
          aria-describedby="emailHelp" placeholder="Insert an email" />
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input v-model="input.password" type="password" class="form-control" id="exampleInputPassword1" />
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-danger">Cancel</button>
        <button @click="postLogin(input.email, input.password)" type="submit" class="btn btn-primary">
          Sign In
        </button>
      </div>
    </form>
    <hr />
    <h2>{{ response }}</h2>
  </div>
</template>

<script>
  /* eslint-disable */
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  export default {
    name: "login",
    props: {
      input: {
        email: "",
        password: ""
      }
    },
    methods: {
      ...mapActions(['postLogin']),
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .form-group {
    width: 50%;
    margin: 0 auto;
  }

  .form-group input {
    border: 1pt solid black;
    /* width: 25%; */
    margin-left: 5px;
    display: inline;
    /* margin-bottom: 10px; */
  }

  .form-group label {
    width: 15%;
    text-align: right;
  }
</style>