import Vue from "vue";
import Vuex from "vuex";

import Posts from "../wareHouse/Posts";
import Auth from "../wareHouse/Auth";

Vue.use(Vuex);
const store = new Vuex.Store({
  name: "store",
  state: {
    status: "",
    profile: {
      isAdmin: false,
      isAuthor: false
    },
    authorization: "",
    posts: [],
    currentPostId: "",
    currentPost: {}
  },
  mutations: {},
  actions: {},
  modules: {
    Posts,
    Auth
  }
});

export default store;
