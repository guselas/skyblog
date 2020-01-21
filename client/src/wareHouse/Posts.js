import axios from 'axios';
// import router from '../router/index'


const state = {
    status: '',

    bearerToken: '',
    posts: [],
    currentPostId: '',
    currentPost: {}
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
    async getAllPosts({
        commit
    }) {
        commit('posts_request');
        /* eslint-disable no-console */
        console.log(this.state);
        /* eslint-enable no-console */
        let axiosReqConfig = {};
        if (this.state.bearerToken) {
            axiosReqConfig.headers = {
                'Authorization': "Bearer " + this.state.bearerToken
            }
        }
        let res = await axios.get('http://localhost:3000/api/blog', axiosReqConfig);
        /* eslint-disable no-console */

        /* eslint-enable no-console */
        commit('posts_data', res.data.data)
        return res;
    },

    //  Get a specific Post
    async getSpecificPost({
        commit
    }) {
        commit('post_request');
        let blogId = this.state.currentBlogId;
        let axiosReqConfig = {};
        if (this.state.bearerToken) {
            axiosReqConfig.headers = {
                'Authorization': "Bearer " + this.state.bearerToken
            }
        }

        let res = await axios.get(`http://localhost:3000/api/blog/${blogId}`, axiosReqConfig);
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