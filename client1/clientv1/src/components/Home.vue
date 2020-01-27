<template>
  <div class="home">
    <div class="card">
      <div class="card-header">
        <h3>Posts</h3>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <a class="navbar-brand" href="#">Posts</a>
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item active">
                <a class="nav-link" href="#"
                  >DC Comics <span class="sr-only">(current)</span></a
                >
              </li>
              <li class="nav-item active">
                <a class="nav-link" href="#"
                  >Marvel Comics <span class="sr-only">(current)</span></a
                >
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  Filter
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <a class="dropdown-item" href="#">Latest Posts</a>
                  <a class="dropdown-item" href="#">Most liked</a>
                  <a class="dropdown-item" href="#">My Posts</a>
                </div>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <input
                class="form-control mr-sm-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button
                class="btn btn-outline-success my-2 my-sm-0"
                type="submit"
              >
                Search
              </button>
            </form>
          </div>
        </nav>
      </div>
      <!-- Posts cards Area -->
      <div class="card-body">
        <div class="row">
          <div
            v-for="(post, i) in this.$store.state.posts[0]"
            :key="post.id"
            class="col-md-4 jumbotron"
          >
            <a href="">
              <div class="card-header">{{ post.postTitle }} // {{ i }}</div>
            </a>
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

  methods: {
    async getPosts() {
      let postsResponse = await axios.get("http://localhost:3000/api/blog");
      this.$store.state.posts.push(postsResponse.data.data);
      /* eslint-disable no-console */
      await console.log("this.$store.state.posts", this.$store.state.posts[0]);
      /* eslint-enable no-console */
    }
  },
  async created() {
    await this.getPosts();
  }
};
</script>

<style></style>
