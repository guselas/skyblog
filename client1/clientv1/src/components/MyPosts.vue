<template>
  <div>
    <h3>My Posts</h3>
    <div class="container">

      <!-- Modals Area -->
      <b-modal id="modal-delete">
        <p class="my-4">
          This post and <b-badge variant="danger">all comments</b-badge> will
          be deleted for ever
        </p>
      </b-modal>

      <b-modal ref="my-editPost" id="modal-edit" title="Edit Post" @show="resetModal" @hidden="resetModal"
        @ok="handleOk">
        <!-- Post Edit Alert Errors Messages -->
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ errorMsg }}
        </b-alert>
        <!--End Post Edit Alert Errors Messages -->

          <h3>Post Title</h3>
          <b-form-textarea id="textarea-postTitle" size="lg" v-model="postEditTitleInput" :state="nameState" required>
          </b-form-textarea>
          <br />
          <h3>Post Content</h3>
          <b-form-textarea id="textarea-postText" size="lg" v-model="postEditTextInput" :state="nameState" required>
            ></b-form-textarea>
          <p>{{ postDateUpdate }}</p>
          <p>{{ postLastUpdate }}</p>
            <button @click="handleSubmit()"> SAVE </button>
      </b-modal>

      <!-- End Modals Area -->
      <div v-for="(post,index) in myPosts" :key="post.Id">
        <div class="card">
          <div class="card-header">
            <p>{{ post.nickName}}</p>
            <p>{{ post.email}}</p>
            {{post.postTitle}} // {{ index }}
          </div>
          <div class="card-body">
            {{post.postText }}

          </div>
          <div class="card-footer">
            <div>
              <b-button v-b-modal.modal-delete variant="danger" @click="loadPostInfo(index)">Delete</b-button>
              <b-button v-b-modal.modal-edit @click="loadPostInfo(index)">Edit</b-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        currentPost: null,
        postId: '',
        postEditTitleInput: "Default Text",
        postEditTextInput: "Default Content Text",
        postDateUpdate: new Date(),
        postLastUpdate: new Date,
        nameState: null,
        errorMsg: "",
        showDismissibleAlert: false
      };
    },
    computed: {
      myPosts() {
        return this.$store.state.myPosts;
      }
    },
    methods: {
      async getMyPosts() {
        let myPostsResponse = await axios.get("http://localhost:3000/api/blog/myposts");
        this.$store.dispatch("setMyPosts", myPostsResponse.data.data);
      },
      loadPostInfo(index) {
        this.currentPost = this.myPosts[index];
        this.postId = this.currentPost.id;
        this.postEditTitleInput = this.currentPost.postTitle;
        this.postEditTextInput = this.currentPost.postText;
        this.postDateUpdate = this.currentPost.postDate;
        this.postLastUpdate = this.currentPost.lastUpdate;

      },
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity();
        this.nameState = valid;
        return valid;
      },
      showModal() {
        this.$refs['my-editPost'].show()
      },
      hideModal() {
        this.$refs['my-editPost'].hide()
      },
      resetModal() {
        this.showDismissibleAlert = false;
        this.nameState = null;
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault();
        // Trigger submit handler
        this.handleSubmit();
      },
      async handleSubmit() {
        // Exit when the form isn't valid
        
        try {
          let postDTO = {
            id: this.currentPost.id,
            rowVersion: this.currentPost.rowVersion,
            postTitle: this.postEditTitleInput,
            postText: this.postEditTextInput,
            postDate: this.currentPost.postDate
          };
          await axios.put(
            `http://localhost:3000/api/blog/${postDTO.id}`,
            postDTO
          );
          await this.getMyPosts();
          this.hideModal();
          this.$nextTick(()=>{});
          
        } catch (error) {
          this.showDismissibleAlert = true;
          this.errorMsg = error.response.data.message;
        }
        // Push the name to submitted names
      },

    },
    async mounted() {
      await this.getMyPosts();
    }
  };
</script>

<style scoped>
  .b-button {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>