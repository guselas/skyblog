import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    authorization: "",
    profile: {},
    posts: [],
    categories: [],
    currentPostId: "",
    currentPost: {},
    myPosts: [],
    badwords: [],
    currentBadword: {}
  },
  getters: {
    isAuthenticated(state) {
      return "nickName" in state.profile;
    },
    isAuthor(state) {
      if ("nickName" in state.profile) {
        return state.profile.isAuthor;
      }
    },
    isAdmin(state) {
      if ("nickName" in state.profile) {
        return state.profile.isAdmin;
      }
    },
    isBlocked(state) {
      if ("nickName" in state.profile) {
        return state.profile.isBlocked;
      }
    },
    nickName(state) {
      if ("nickName" in state.profile) {
        return state.profile.nickName;
      } else {
        return "anonymous";
      }
    },
    email(state) {
      if ("nickName" in state.profile) {
        return state.profile.email;
      } else {
        return "anonymous";
      }
    },
    id(state) {
      if ("nickName" in state.profile) {
        return state.profile.id;
      } else {
        return "";
      }
    }
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
      // console.log(' commit("setAuthorization"): ', state.authorization);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    unsetAuthorization(state) {
      state.authorization = "";
      /* eslint-disable no-console */
      // console.log(' commit("unsetAuthorization"): ', state.authorization);
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
      // console.log(' commit("setProfile"): ', state.profile);
      /* eslint-enable no-console */
    },
    //------------------------------------------
    unsetProfile(state) {
      state.profile = {};
      /* eslint-disable no-console */
      // console.log(' commit("unsetProfile"): ', state.profile);
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
    setMyPosts(state, payload) {
      state.myPosts = payload;
    },
    //------------------------------------------
    deleteMyPost(state, payload) {
      state.myPosts = payload;
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
    },
    //------------------------------------------
    setCategories(state, payload) {
      state.categories = payload;
    },
    //------------------------------------------
    setBadwords(state, payload) {
      state.badwords = payload;
    },
    //------------------------------------------
    unsetBadwords(state) {
      state.badwords = [];
    }
  },
  actions: {
    //------------------------------------------
    setAuthorization({ commit }, payload) {
      /* eslint-disable no-console */
      // console.log("setAuthorization()", payload);
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
        // console.log("setProfile()", payload);
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
        // console.log("setPosts()", payload);
        /* eslint-enable no-console */
        commit("setPosts", payload);
      } else {
        commit("unsetPosts");
      }
    },
    //------------------------------------------
    setMyPosts({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        // console.log("setMyPosts()", payload);
        /* eslint-enable no-console */
        commit("setMyPosts", payload);
      }
    },
    //------------------------------------------
    deleteMyPost({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        // console.log("deleteMyPost()", payload);
        /* eslint-enable no-console */
        commit("deleteMyPost", payload);
      }
    },
    //------------------------------------------
    setCurrentPost({ commit }, payload) {
      if (payload) {
        commit("setCurrentPost", payload);
      } else {
        commit("unsetCurrentPost");
      }
    },
    //------------------------------------------
    setCategories({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        // console.log("setCategories()", payload);
        /* eslint-enable no-console */
        commit("setCategories", payload);
      }
    },
    //------------------------------------------
    setBadwords({ commit }, payload) {
      if (payload) {
        /* eslint-disable no-console */
        // console.log("setPosts()", payload);
        /* eslint-enable no-console */
        commit("setBadwords", payload);
      } else {
        commit("unsetBadwords");
      }
    }
  },
  modules: {}
});
