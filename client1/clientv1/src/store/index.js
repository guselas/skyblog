import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorization: "",
    profile: {},
    posts: [],
    currentPostId: "",
    currentPost: {}
  },
  mutations: {
    //------------------------------------------
    setAuthorization(state, payload) {
      if (payload) {
        if (payload.Authorization) {
          state.authorization = payload.Authorization;
        } else {
          state.authorization = "";
        }
      } else {
        state.authorization = "";
      }
      /* eslint-disable no-console */
      console.log(' commit("setAuthorization"): ', state.authorization);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    unsetAuthorization(state) {
      state.authorization = "";
      /* eslint-disable no-console */
      console.log(' commit("unsetAuthorization"): ', state.authorization);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    setProfile(state, payload) {
      if (payload) {
        state.profile = payload;
      } else {
        state.profile = {};
      }
      /* eslint-disable no-console */
      console.log(' commit("setProfile"): ', state.profile);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    unsetProfile(state) {
      state.profile = {};
      /* eslint-disable no-console */
      console.log(' commit("unsetProfile"): ', state.profile);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    setPosts(state, payload) {
      state.posts = payload;
    },
    //------------------------------------------
    unsetPosts(state) {
      state.posts = [];
    },
    //------------------------------------------
    setCurrentPost(state, payload) {
      if (payload) {
        state.currentPostId = payload.id;
        state.currentPost = payload;
      } else {
        state.currentPostId = "";
        state.currentPost = {};
      }
    },
    //------------------------------------------
    unsetCurrentPost(state) {
      state.currentPostId = "";
      state.currentPost = {};
    }
  },
  actions: {
    //------------------------------------------
    setAuthorization({ commit }, payload) {
      /* eslint-disable no-console */
      console.log("setAuthorization()", payload);
      /* eslint-enable no-console */
      commit("setAuthorization", payload);
      if (payload.rememberMe) {
        localStorage["authorization"] = payload.Authorization;
      } else {
        delete localStorage["authorization"];
      }
    },
    //------------------------------------------
    unsetAuthorization({ commit }) {
      commit("unsetAuthorization");
      delete localStorage["authorization"];
    },
    //------------------------------------------
    setProfile({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        console.log("setProfile()", payload);
        /* eslint-enable no-console */
        commit("setProfile", payload);
      } else {
        commit("unsetProfile");
      }
    },
    //------------------------------------------
    setPosts({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        console.log("setPosts()", payload);
        /* eslint-enable no-console */
        commit("setPosts", payload);
      } else {
        commit("unsetPosts");
      }
    },
    //------------------------------------------
    setCurrentPost({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        console.log("setCurrentPost()", payload);
        /* eslint-enable no-console */
        commit("setCurrentPost", payload);
      } else {
        commit("unsetCurrentPost");
      }
    }
  },
  modules: {}
});
