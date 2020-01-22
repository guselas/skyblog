import axios from "axios";
// import router from '../router/index'

const state = {
  status: "",
  bearerToken: "",
  posts: [],
  currentPostId: "",
  currentPost: {}
};
const actions = {
  // Post Login
  async postLogin({ commit }, user) {
    commit("post_login");
    /* eslint-disable no-console */

    /* eslint-enable no-console */

    let res = await axios.post("http://localhost:3000/api/blog/login", user);
    /* eslint-disable no-console */
    console.log("Res from login:", res);

    /* eslint-enable no-console */
    commit("post_login_data", res.data);
    return res;
  }
};
const mutations = {
  posts_request(state) {
    state.status = "login";
  },
  post_login_data(state, bearerToken) {
    state.bearerToken = bearerToken;
  }
};
export default {
  state,
  actions,
  mutations
};
