<template>
  <div class="home">
    <div class="card">
      <!-- Posts Nav Bar -->
      <div class="card-header">
        <h3>Posts</h3>
        <div>
          <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">Posts</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-button v-for="item in categories" :key="item" @click="getPostsByCategory(item)">{{ item }}</b-button>
              </b-navbar-nav>

              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                <b-nav-form>
                  <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                  <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
                </b-nav-form>

                <b-nav-item-dropdown text="Lang" right>
                  <b-dropdown-item href="#">EN</b-dropdown-item>
                  <b-dropdown-item href="#">ES</b-dropdown-item>
                  <b-dropdown-item href="#">RU</b-dropdown-item>
                  <b-dropdown-item href="#">FA</b-dropdown-item>
                </b-nav-item-dropdown>

              </b-navbar-nav>
            </b-collapse>
          </b-navbar>
        </div>
      </div>
      <!-- End Posts Nav Bar -->
      <!-- Posts cards Area -->
      <div class="card-body">
        <div class="row">
          <div v-for="post in this.$store.state.posts" :key="post.id" class="col-md-4 jumbotron">
            <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
              <div class="card-header">{{ post.postTitle }}</div>
            </router-link>
            <div class="card-body">
              {{ post.postText }}
            </div>
            <div class="card-footer">
              {{ post.nickName }} // {{ post.postDate }} // Likes
            </div>
          </div>
        </div>
      </div>
      <!--End Posts cards Area -->
    </div>
  </div>
</template>

<script>
  import axios from "axios";
  // @ is an alias to /src

  export default {
    name: "home",
    computed: {
      categories() {
        return this.$store.state.categories;
      }
    },
    methods: {
      async getPosts() {
        let category = this.$route.query.category;
        let postsResponse;
        if (category) {
          category = encodeURI(category);
          /* eslint-disable no-console */
          console.log("category: ", category);
          /* eslint-enable no-console */

          postsResponse = await axios.get(`http://localhost:3000/api/blog?category=${category}`);

        } else {
          postsResponse = await axios.get("http://localhost:3000/api/blog");
        }
        this.$store.dispatch("setPosts", postsResponse.data.data);
      },
      async getPostsByCategory(category) {

        if (category) {
          category = encodeURI(category);
                   let postsResponse = await axios.get(`http://localhost:3000/api/blog?category=${category}`);
          this.$store.dispatch("setPosts", postsResponse.data.data);
        }
      },

      async getCategories() {
        let categoriesResponse = await axios.get("http://localhost:3000/api/blog/categories");
        this.$store.dispatch("setCategories", categoriesResponse.data);
      }
    },
    async created() {
      await this.getPosts();
      await this.getCategories();
    },
  };
</script>

<style></style>