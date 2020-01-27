<template id="postDetail">
  <div class="postDetail">
    <!-- PostDetails -->
    <div class="card">
      <div class="card-header">
        <h2>post.title</h2>
      </div>
      <div class="card-body">
        <img
          class="imgPostDetail"
          src="../components/assets/twitter.png"
          alt="aca no hay imagen"
        />
        post.image post.postText
      </div>
      <div class="footer">
        <p>post.nickName</p>
      </div>
    </div>
    <!-- End Post Details -->

    <!-- Comments Details -->
    <div class="card">
      <button>Add comment</button>
      <div class="card-header">
        <h2>post.comment</h2>
      </div>
      <div class="card-body">
        post.commentText
      </div>
      <div class="footer">
        <p>post.comments</p>
      </div>
    </div>
    <!-- End Comments Details -->
  </div>
</template>

<script>
// import { mapActions, mapGetters } from "vuex";
export default {
  name: "postDetail",
  data: function() {
    return {};
  }
  // computed: mapGetters(["posts"]),
  // methods: {
  //   ...mapActions(["getSpecificPost"])
  // },
  // created() {
  //   this.getSpecificPost();
  // }
};
</script>

<style>
.imgPostDetail {
  height: 150px;
}
</style>
