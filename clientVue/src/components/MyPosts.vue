<template>
  <div>
    <!-- Post Alert Error Messages -->
    <b-alert v-model="showDismissibleAlert" :variant="variant" dismissible>{{
      errorMsg
    }}</b-alert>
    <!--End Post Alert Error Messages -->
    <br />
    <div class="container">
      <!-- Modals Area -->
      <b-modal id="modal-delete">
        <p class="my-4">
          This post and <b-badge variant="danger">all comments</b-badge> will be
          deleted for ever
        </p>
      </b-modal>

      <b-modal
        ref="my-editPost"
        id="modal-edit"
        title="Edit Post"
        size="lg"
        @hidden="resetModal"
        @ok="handleOk"
        @show="resetModal"
      >
        <!-- Post Edit Alert Errors Messages -->
        <b-alert v-model="showDismissibleAlert" variant="danger" dismissible>
          {{ errorMsg }}
        </b-alert>
        <!--End Post Edit Alert Errors Messages -->

        <h3>Post Title</h3>
        <b-form-textarea
          id="textarea-postTitle"
          size="lg"
          v-model="postEditTitleInput"
          :state="nameState"
          required
        >
        </b-form-textarea>
        <br />
        <h3>Post Content</h3>
        <b-form-textarea
          id="textarea-postText"
          size="lg"
          v-model="postEditTextInput"
          :state="nameState"
          required
        >
        </b-form-textarea>
        <br />
        <h3>Post Category</h3>
        <br />
        <b-form-textarea
          id="textarea-postCategory"
          v-model="category"
          :state="nameState"
          required
        ></b-form-textarea>
        <p>
          <b-badge variant="primary"> Post Date </b-badge>
          {{ moment(postDateUpdate).format("LLL") }}
        </p>
        <p>
          <b-badge variant="primary"> Post Updated </b-badge>
          {{ moment(postLastUpdate).format("LLL") }}
        </p>
        <!-- <button @click="handleSubmit()">SAVE</button> -->
      </b-modal>

      <!-- End Modals Area -->
      <div v-if="myPostsLength">
        <h3 id="myPostsTitle">My Posts</h3>
        <div v-for="(post, index) in myPosts" :key="post.Id">
          <div class="card">
            <div class="card-header" style="text-align:center;">
              {{ post.postTitle }}
            </div>
            <div class="card-body">
              {{ post.postText }}
            </div>
            <div class="card-footer">
              <div>
                <b-form inline>
                  <p style="text-align:center">
                    <b-badge variant="primary"> NickName: </b-badge
                    >{{ post.nickName }}
                  </p>
                  <hr />
                  <p style="text-align:right">
                    <b-badge variant="primary">Email:</b-badge> {{ post.email }}
                  </p>
                  <hr />
                  <b-button
                    v-b-modal.modal-delete
                    prevent-closing
                    variant="danger"
                    @click="deletePost(index)"
                    >Delete
                  </b-button>
                  <b-button
                    v-b-modal.modal-edit
                    prevent-closing
                    @click="loadPostInfo(index)"
                    >Edit</b-button
                  >
                </b-form>
              </div>
            </div>
          </div>
          <br />
        </div>
      </div>
      <div v-if="!myPostsLength">
        <h3 style="text-align:center;">You got no posts yet!</h3>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      currentPost: null,
      postId: "",
      postEditTitleInput: "",
      postEditTextInput: "",
      postDateUpdate: new Date(),
      postLastUpdate: new Date(),
      category: "",
      nameState: null,
      errorMsg: "",
      showDismissibleAlert: false,
      variant: "danger",
      moment: moment
    };
  },
  computed: {
    myPosts() {
      return this.$store.state.myPosts;
    },
    myPostsLength() {
      return this.$store.state.myPosts.length;
    }
  },
  methods: {
    async getMyPosts() {
      let myPostsResponse = await axios.get(
        "http://localhost:3000/api/blog/myposts"
      );
      this.$store.dispatch("setMyPosts", myPostsResponse.data.data);
    },
    loadPostInfo(index) {
      this.currentPost = this.myPosts[index];
      this.postId = this.currentPost.id;
      this.postEditTitleInput = this.currentPost.postTitle;
      this.postEditTextInput = this.currentPost.postText;
      this.category = this.currentPost.category;
      this.postDateUpdate = this.currentPost.postDate;
      this.postLastUpdate = this.currentPost.lastUpdate;
    },
    async deletePost(index) {
      let postId = this.myPosts[index].id;
      try {
        let postDTO = {
          id: postId
        };
        let deletePostResponse = await axios.delete(
          `http://localhost:3000/api/blog/${postDTO.id}`
        );
        this.$store.dispatch("deleteMyPost", deletePostResponse.data.data);
        this.showWarning(`${postDTO} deleted`);
        await this.getMyPosts();
      } catch (error) {
        this.showError(error.response.data.message);
      }
    },
    checkFormValidity() {
      const valid = this.$refs.form.checkValidity();
      this.nameState = valid;
      return valid;
    },
    showModal() {
      this.$refs["my-editPost"].show();
    },
    hideModal() {
      this.$refs["my-editPost"].hide();
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
      try {
        let postDTO = {
          id: this.currentPost.id,
          rowVersion: this.currentPost.rowVersion,
          postTitle: this.postEditTitleInput,
          postText: this.postEditTextInput,
          category: this.category,
          postDate: this.currentPost.postDate
        };
        await axios.put(
          `http://localhost:3000/api/blog/${postDTO.id}`,
          postDTO
        );
        await this.getMyPosts();
        this.hideModal();
        this.showSuccess(`${postDTO.postTitle} updated`);
        this.$nextTick(() => {});
      } catch (error) {
        this.showError(error.response.data.message);
        // this.showDismissibleAlert = true;
        // this.errorMsg = error.response.data.message;
      }
    },
    // Aux alert Methods
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
    showWarning(message) {
      this.errorMsg = message;
      this.variant = "warning";
      this.showDismissibleAlert = true;
    }
  },
  async created() {
    await this.getMyPosts();
  }
};
</script>

<style scoped>
.b-button {
  margin-top: 10px;
  margin-bottom: 10px;
}

#myPostsTitle {
  font-family: "Sedgwick Ave", cursive;
}
</style>
