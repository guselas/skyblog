<template>
  <div id="register">
    <b-card class="text-center">
      <h3 id="profileTitle">Profile</h3>
      <b-card-body>
        <form class="text-center">
          <div class="form-group form-inline ">
            <label for="InputEmail" class="col-sm-2 col-form-label"
              >Email address</label
            >
            <input
              v-model="user.email"
              @input="user.email"
              type="email"
              class="form-control"
              id="InputEmail"
              aria-describedby="emailHelp"
            />
          </div>
          <div class="form-group form-inline">
            <label for="InputPassword" class="col-sm-2 col-form-label"
              >Password</label
            >
            <input
              v-model="user.password"
              @input="user.password"
              type="password"
              class="form-control"
              id="InputPassword"
            />
          </div>
          <div class="form-group form-inline">
            <label for="InputPassword" class="col-sm-2 col-form-label"
              >Confirm Password</label
            >
            <input
              type="password"
              class="form-control"
              id="InputPasswordConfirm"
            />
          </div>

          <div class="form-group form-inline">
            <label for="InputPassword" class="col-sm-2 col-form-label"
              >Nick Name</label
            >
            <input
              v-model="user.nickName"
              @input="user.nickName"
              type="text"
              class="form-control"
              id="InputnickName"
            />
          </div>
        </form>
      </b-card-body>
      <button
        id="btnC"
        class="btn btn-success"
        @click.prevent="submitRegisterForm"
      >
        Save Profile
      </button>
      <button id="btnC" class="btn btn-danger">
        Delete Account
      </button>

      <div></div>
    </b-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: this.$store.state.profile.__ob__.value.email,
        nickName: this.$store.state.profile.__ob__.value.nickName,
        password: ""
      }
    };
  },
  methods: {
    getUser() {
      return this.$store.state.profile.value;
    }
  },
  created() {
    this.getUser();
  }
};
</script>

<style>
#btnC {
  margin: 10px;
}

#profileTitle {
  font-family: "Sedgwick Ave", cursive;
}
</style>
