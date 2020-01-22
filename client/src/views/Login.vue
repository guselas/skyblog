<template>
  <div>
    <h2>Login</h2>

    <form @submit.prevent="postLogin" id="loginForm">
      <div class="form-group">
        <label>Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          aria-describedby="emailHelp"
          placeholder="Insert an email"
        />
      </div>

      <div class="form-group">
        <label for="exampleInputPassword1" placeholder="Insert a password">Password</label>
        <input v-model="password" type="password" class="form-control" />
      </div>

      <div class="form-group">
        <router-link to="/">
          <button type="submit" class="btn btn-danger">Cancel</button>
        </router-link>
        <router-link to="/">
          <button type="submit" class="btn btn-primary" @click="login">
            Sign In
          </button>
        </router-link>
      </div>
    </form>
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
    data() {
      return {
        email: "",
        password: ""
      }
    },
    // props: {
    //   input: {
    //     email: "",
    //     password: ""
    //   }
    // },
    methods: {
      ...mapActions(['postLogin']),
      login() {
        let user = {
          email: this.email,
          password: this.password
        };
        this.postLogin(user)
          .then(res => {
            /* eslint-disable  no-console*/
            console.log("res", res.data.Authorization);
            // console.log("store: ",store);
            console.log("window: ",window);
            /* eslint-disable  no-console*/
            let bearerToken = (res.data.Authorization).replace('Bearer', '');
            console.log("bearerToken: ", bearerToken);
            if (bearerToken) {
              this.$router.push('/');
            }
          })
          .catch(err => {
            /* eslint-disable  no-console*/
            console.log(err);
            /* eslint-disable  no-console*/

          })
      }
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