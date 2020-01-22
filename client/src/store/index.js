import Vue from "vue";
import Vuex from "vuex";

import Posts from "../wareHouse/Posts";
import Auth from "../wareHouse/Auth";

Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    status: "",

    bearerToken: "",
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
