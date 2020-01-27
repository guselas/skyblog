<template>
  <div id="register">
    <div class="container">
      <h1>Profile Vue</h1>
      <div class="row">
        <div class="col-9">
          <form>
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
              <button class="btn btn-success">Save</button>
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
              <button class="btn btn-success">Save</button>
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
              <button class="btn btn-success">Save</button>
            </div>
          </form>
        </div>
        <div class="col-3">
          <div>
            <button class="btn btn-success" @click.prevent="submitRegisterForm">
              Save Profile
            </button>
          </div>
          <br />
          <div>
            <button class="btn btn-danger">
              Delete Account
            </button>
          </div>
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {
        email: "blogger1@gmail.com",
        nickName: "Blogger1",
        password: "123"
      }
    };
  }
};
</script>
