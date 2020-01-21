import axios from 'axios';
// import router from '../router/index'
const state = {
    token: localStorage.getItem('token') || '',
    posts: [],
    status: '',
    post: []
};
const getters = {
    posts: state => state.posts,
    post: state => state.post
};
const actions = {
    // Get all Posts
    async getAllPosts({commit}) {
        commit('posts_request');
        let res = await axios.get('http://localhost:3000/api/blog');
        /* eslint-disable no-console */
        // console.log("Res", res.data.data[0].postTitle);
        console.log("Res", res);

        /* eslint-enable no-console */
        commit('posts_data', res.data.data)
        return res;
    },
    //  Get a specific Post
    async getSpecificPost({
        commit
    }) {
        commit('post_request');
        let res = await axios.get('http://localhost:3000/api/blog' + window.document.location.pathname);
        /* eslint-disable no-console */

        /* eslint-enable no-console */
        commit('post_data', res.data.post)
        return res;
    },
    //  Create new Post
    async createPost({
        commit
    }, postData) {
        try {
            commit('createPost_request');
            let res = await axios.post("http://localhost:3000/api/blog", postData);
            if (res.data.success !== undefined) {
                commit('createPost_success');
            }
            return res;
        } catch (err) {
            commit('createPost_error', err);
        }
    }
};
const mutations = {
    posts_request(state) {
        state.status = 'loading'
    },
    posts_data(state, posts) {
        state.posts = posts
    },
    post_data(state, post) {
        state.post = post
    },
    createPost_request(state) {
        state.status = 'loading'
    },
    createPost_success(state) {
        state.status = 'success'
    },
};
export default {
    state,
    actions,
    mutations,
    getters
};