<template>
  <div id="register">
    <!-- Errors Alert Area  -->
    <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
      {{ errorMsg }}
    </b-alert>
    <!-- End Errors Alert Area -->

    <div class="card">
      <div class="card-header">
        <h3>Register Vue</h3>
      </div>
      <br />
      <br />
      <div class="card-body">
        <div class="container">
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
              <button
                class="btn btn-primary"
                @click.prevent="submitRegisterForm"
              >
                Register
              </button>
              <button class="btn btn-danger">
                Cancel
              </button>
            </div>
          </form>
          <br />
          <div style="text-align:center">
            <mark
              >Registering to this site you accept all
              <a
                href="https://www.termsfeed.com/blog/sample-terms-and-conditions-template/"
                >terms and conditions</a
              >*
            </mark>
          </div>
        </div>
      </div>
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
      },
      errorMsg: "",
      showDismissibleAlert: false
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
        await axios.post(
          "http://localhost:3000/api/blog/register",
          registerDTO
        );
        this.$router.replace("/login");
      } catch (error) {
        this.showDismissibleAlert = true;
        this.errorMsg = error.response.data.message;
      }
    }
  }
};
</script>

<style></style>
