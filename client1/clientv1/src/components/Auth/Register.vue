<template>
  <div id="register">
    <div class="container">
      <h1>Register Vue</h1>

      <br />
      <br />
      <mark
        >Registering to this site you accept all
        <a
          href="https://www.termsfeed.com/blog/sample-terms-and-conditions-template/"
          >terms and conditions</a
        >*
      </mark>
      <br />
      <br />

      <form>
        <div class="form-group">
          <label for="InputEmail1">Email address</label>
          <input
            v-model="user.email"
            @input="user.email"
            type="email"
            class="form-control"
            id="InputEmail1"
            aria-describedby="emailHelp"
          />
        </div>
        <div class="form-group">
          <label for="InputPassword1">Password</label>
          <input
            v-model="user.password"
            @input="user.password"
            type="password"
            class="form-control"
            id="InputPassword"
          />
        </div>

        <div class="form-group">
          <label for="InputPassword1">Nick Name</label>
          <input
            v-model="user.nickName"
            @input="user.nickName"
            type="text"
            class="form-control"
            id="InputnickName"
          />
        </div>
        <div style="text-align:center">
          <button class="btn btn-primary" @click.prevent="submitRegisterForm">
            Register
          </button>
          <button class="btn btn-danger">
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
// import router from 'vuex';

export default {
  data() {
    return {
      user: {
        email: "blogger1@gmail.com",
        nickName: "Blogger1",
        password: "123"
      }
    };
  },
  methods: {
    async submitRegisterForm() {
      try {
        let registerDTO = {
          email: this.user.email,
          nickName: this.user.nickName,
          password: this.user.password
        };
        let registerResponse = await axios.post(
          "http://localhost:3000/api/blog/register",
          registerDTO
        );
        /* eslint-disable no-console */
        console.log("Response", registerResponse);
        /* eslint-enable no-console */
        // alert("User created correctly");
        this.$router.push("login");
      } catch (error) {
        /* eslint-disable no-console */
        console.log("Error", error);
        /* eslint-enable no-console */
        alert("User already exists");
      }

      // let data = loginResponse.data;

      // await this.$store.dispatch("setAuthorization", data);
      // let profileResponse = await axios.get(
      //     "http://localhost:3000/api/blog/profile"
      // );
      // await this.$store.dispatch("setProfile", profileResponse.data);
    }
  }
};
</script>

<style></style>
