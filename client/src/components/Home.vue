<template>
  <div class="home">
    <!-- Posts Alert Error Messages -->
    <b-alert v-model="showDismissibleAlert" :variant="variant" dismissible>{{
      errorMsg
    }}</b-alert>
    <!--End Posts Alert Error Messages -->

    <div class="card">
      <!-- Modals Area -->
      <b-modal id="modal-create" title="Post Details Create" size="lg" @ok="savePost()">
        <!-- End Modals Area -->
        <!-- Post Edit Alert Errors Messages -->
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ errorMsg }}
        </b-alert>
        <!--End Post Edit Alert Errors Messages -->

        <b-col sm="10">
          <label for="textarea-large">Post Title:</label>
          <b-form-textarea v-model="dataPostTitle" id="textarea-large" size="lg"></b-form-textarea>
        </b-col>
        <hr />
        <b-col sm="10">
          <label for="textarea-large">Post content:</label>
          <b-form-textarea v-model="dataPostText" id="textarea-large" size="lg">
          </b-form-textarea>
        </b-col>
        <hr />
        <label class="sr-only" for="inline-form-input-category">Category</label>
        <b-input-group prepend="@" class="mb-2 mr-sm-2 mb-sm-0">
          <b-input v-model="dataCategory" id="inline-form-input-category" placeholder="Category"></b-input>
        </b-input-group>
        <hr />
        <div class="input-group">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <input type="radio" aria-label="Radio button for following text input" />
            </div>
          </div>
          <input type="text" readonly class="form-control" placeholder="Accept terms and conditions"
            aria-label="Text input with radio button" />
        </div>
      </b-modal>
      <!-- End Modal Area -->
      <!-- Posts Nav Bar -->
      <div class="card-header">
        <h3 id="postsTitle">Posts</h3>
        <div>
          <b-navbar toggleable="lg" type="dark" variant="dark">
            <b-navbar-brand href="#">Posts</b-navbar-brand>

            <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

            <b-collapse id="nav-collapse" is-nav>
              <b-navbar-nav>
                <b-button v-for="item in categories" :key="item" @click="getPostsByCategory(item)">{{ item }}</b-button>
              </b-navbar-nav>
              <b-button v-if="isAuthor" v-b-modal.modal-create variant="primary" size="md">New Post</b-button>

              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                <b-form-input v-model="textSearch" size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
                <b-button size="sm" @click="search()" class="my-2 my-sm-0">Search</b-button>

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
      <div class="card">
        <div class="row">
          <div v-for="post in posts" :key="post.id" class="col-md-4 jumbotron">
            <router-link :to="{ name: 'postDetail', params: { id: post.id } }">
              <div class="card-header" style="text-align:center">
                {{ post.postTitle }}
              </div>
            </router-link>
            <div id="postTextContainer" class="card-body">

                <p id="postText" >{{ post.postText? post.postText.substring(0,200) : "" }}{{ post.postText? (post.postText.length > 200 ? "..." : "" ): ""}}</p>

            </div>
            <div class="card-footer">
              <div>
                <b-badge variant="info">Author NickName</b-badge>
                {{ post.nickName }}
              </div>
              <div>
                <b-badge variant="info">Author email</b-badge> {{ post.email }}
              </div>
              <div>
                <b-badge variant="info">Post date</b-badge>
                {{ moment(post.postDate).format("LL") }}
              </div>
              <div>
                <b-badge variant="info">Category</b-badge> {{ post.category }}
              </div>
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
  import moment from "moment";
  // @ is an alias to /src

  export default {
    name: "home",
    data() {
      return {
        textSearch: "",
        currentPost: null,
        postId: "",

        dataPostTitle: "",
        dataPostText: "",
        dataCategory: "",

        nameState: null,
        errorMsg: "",
        variant: "danger",
        showDismissibleAlert: false,

        moment: moment
      };
    },
    computed: {
      categories() {
        return this.$store.state.categories;
      },
      posts() {
        return this.$store.state.posts;
      },
      isAuthor() {
        return this.$store.getters.isAuthor;
      },
      isAdmin() {
        return this.$store.getters.isAdmin;
      }
    },
    methods: {
      async search() {
        let postsResponse = await axios.get(
          `http://localhost:3000/api/blog/search?textsearch=${this.textSearch}`
        );
        this.$store.dispatch("setPosts", postsResponse.data.data);
      },

      async getPosts() {
        let category = this.$route.query.category;
        let postsResponse;
        if (category) {
          category = encodeURI(category);
          postsResponse = await axios.get(
            `http://localhost:3000/api/blog?category=${category}`
          );
        } else {
          postsResponse = await axios.get("http://localhost:3000/api/blog");
        }
        this.$store.dispatch("setPosts", postsResponse.data.data);
      },
      async getPostsByCategory(category) {
        if (category) {
          category = encodeURI(category);
          let postsResponse = await axios.get(
            `http://localhost:3000/api/blog?category=${category}`
          );
          this.$store.dispatch("setPosts", postsResponse.data.data);
        }
      },
      async getCategories() {
        let categoriesResponse = await axios.get(
          "http://localhost:3000/api/blog/categories"
        );
        this.$store.dispatch("setCategories", categoriesResponse.data);
      },
      showError(message) {
        this.errorMsg = message;
        this.variant = "danger";
        this.showDismissibleAlert = true;
      },
      showSuccess(message) {
        this.errorMsg = message;
        this.variant = "success";
        this.showDismissibleAlert = true;
      },
      resetModal() {
        this.showDismissibleAlert = false;
        this.nameState = null;
      },
      async savePost() {
        try {
          let postDTO = {
            postTitle: this.dataPostTitle,
            postText: this.dataPostText,
            category: this.dataCategory,
            postDate: new Date()
          };
          await axios.post("http://localhost:3000/api/blog", postDTO);

          await this.getPosts();
          this.showSuccess("Post correctly posted!");
        } catch (error) {
          this.showError(error.response.data.message);
        }
      }
    },
    async created() {
      await this.getPosts();
      await this.getCategories();
    }
  };
</script>

<style>
  #card {
    background-color: #939c9e;
  }

  #postsTitle {
    font-family: "Sedgwick Ave", cursive;
  }
/* 
#postText{
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 80%;
  text-align: center;
  
} */


</style>