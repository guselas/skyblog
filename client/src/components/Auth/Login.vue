<template>
  <div id="login">
    <!-- Login Alert Errors Messages -->
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>{{
      errorMsg
    }}</b-alert>
    <!--End Login Alert Errors Messages -->

    <div class="card">
      <div class="card-header">
        <h3 id="loginTitle">Login</h3>
      </div>
      <div class="card-body">
        <div class="container">
          <form>
            <div class="form-group">
              <label for="InputEmail1">Email address</label>
              <input
                v-model="user.email"
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
                id="InputPassword1"
              />
            </div>
            <div class="form-group form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="Check1"
                v-model="rememberMe"
              />
              <label class="form-check-label" for="Check1">Remember me</label>
            </div>
            <div style="text-align:center">
              <button id="loginSubmit" class="btn btn-primary" @click.prevent="submitLoginForm">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div class="card-footer"></div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      rememberMe: false,
      errorMsg: "",
      showDismissibleAlert: false
    };
  },
  methods: {
    async submitLoginForm() {
      try {
        let loginDTO = {
          email: this.user.email,
          password: this.user.password
        };
        let loginResponse = await axios.post(
          "http://localhost:3000/api/blog/login",
          loginDTO
        );

        let data = loginResponse.data;
        data.rememberMe = this.rememberMe;

        await this.$store.dispatch("setAuthorization", data);
        let config = {
          headers: {
            Authorization: data.Authorization
          }
        };
        let profileResponse = await axios.get(
          "http://localhost:3000/api/blog/profile",
          config
        );
        await this.$store.dispatch("setProfile", profileResponse.data);
        this.$router.replace("/");
      } catch (error) {
        this.showDismissibleAlert = true;
        this.errorMsg = error.response.data.error;
      }
    }
  }
};
</script>

<style scoped>
#card {
  background-color: #939c9e;
}

#loginTitle {
  font-family: "Sedgwick Ave", cursive;
}
</style>
