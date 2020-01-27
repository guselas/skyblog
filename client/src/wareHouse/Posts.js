import axios from "axios";
// import router from '../router/index'

const state = {
  status: "",
  posts: [],
  currentPostId: "",
  post: {}
};

const getters = {
  posts: state => state.posts,
  post: state => {
    for (let post of state.posts) {
      if (post.id == state.currentPostId) {
        return post;
      }
    }
    return null;
  }
};
const actions = {
  // Get all Posts
  async getAllPosts({ commit }) {
    commit("posts_request");
    /* eslint-disable no-console */

    /* eslint-enable no-console */
    let axiosReqConfig = {};
    if (localStorage.authorization) {
      axiosReqConfig.headers = {
        Authorization: localStorage.authorization
      };
    }
    let res = await axios.get("http://localhost:3000/api/blog", axiosReqConfig);
    /* eslint-disable no-console */

    /* eslint-enable no-console */
    commit("posts_data", res.data.data);
    return res;
  },

  //  Get a specific Post
  async getSpecificPost({ commit }) {
    commit("post_request");
    let blogId = this.state.currentPostId;
    let axiosReqConfig = {};
    if (localStorage.authorization) {
      axiosReqConfig.headers = {
        Authorization: localStorage.authorization
      };
    }

    let res = await axios.get(
      `http://localhost:3000/api/blog/${blogId}`,
      axiosReqConfig
    );
    /* eslint-disable no-console */

    /* eslint-enable no-console */
    commit("post_data", res.data.post);
    return res;
  },

  //  Create new Post
  async createPost({ commit }, postData) {
    try {
      commit("createPost_request");
      let res = await axios.post("http://localhost:3000/api/blog", postData);
      if (localStorage["profile.isAdmin"] || localStorage["profile.isAuthor"]) {
        commit("createPost_success");
      }
      return res;
    } catch (err) {
      commit("createPost_error", err);
    }
  }
};
const mutations = {
  //Posts before
  posts_request(state) {
    state.status = "loading";
  },
  //Posts after
  posts_data(state, posts) {
    state.posts = posts;
  },
  //Post before
  post_request(state) {
    state.status = "loading";
  },
  //Post after
  post_data(state, post) {
    state.post = post;
  },
  //Create Post before
  createPost_request(state) {
    state.status = "creating";
  },
  //Create Post fater
  createPost_success(state) {
    state.status = "post posted";
  }
};
export default {
  actions,
  mutations,
  getters,
  state
};
