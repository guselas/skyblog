import axios from "axios";
// import router from '../router/index'

const actions = {
  async register() {},

  // Post Login
  async postLogin({ commit }, user) {
    commit("post_login_request");
    let res_login = await axios.post(
      "http://localhost:3000/api/blog/login",
      user
    );
    /* eslint-disable no-console */

    /* eslint-enable no-console */
    commit("post_login_data", res_login.data.Authorization);

    commit("post_profile_request");
    if (localStorage.authorization) {
      let config = {
        headers: {
          Authorization: localStorage.authorization
        }
      };
      let res_profile = await axios.get(
        "http://localhost:3000/api/blog/profile",
        config
      );

      commit("post_profile_data", res_profile.data);
    }
    return res_login;
  },

  async postLogOut() {
    delete localStorage.authorization;
    for (let field in localStorage) {
      if (field.indexOf("profile.") == 0) {
        delete localStorage[field];
      }
    }
  }
};

const mutations = {
  post_login_request(state) {
    state.status = "login";
  },
  post_login_data(state, authorization) {
    localStorage.authorization = authorization;
    state.status = "loged";
  },
  post_logOut_request(state) {
    state.status = "!loged";
  },
  post_logOut_data(state, authorization) {
    localStorage.authorization = authorization;
    state.status = "!loged";
  },
  post_profile_request(state) {
    state.status = "profile";
  },
  post_profile_data(state, profile) {
    for (let field in profile) {
      localStorage[`profile.${field}`] = profile[field];
    }
    state.status = "profile OK";
  }
};
export default {
  actions,
  mutations
};
