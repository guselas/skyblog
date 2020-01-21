<template>
  <div class="home">
    <div class="card mt-2">
      <div class="card-header bg-primary text-white">
        <h3> <i class="far fa-images"></i> Recent Posts Uploads</h3>
      </div>
      <div class="card-body">
        <div class="row ">
          <div v-for="post in posts" :key="post.id" class="col-md-4 jumbotron">
            <div class="card-header">{{post.postTitle}}</div>
            <div class="card-body"><!--post.image--></div>
            <div class="card.footer">{{post.nickName}}</div>
            <router-link :to="'/post/' + post.id">
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
  import {
    mapActions,
    mapGetters
  } from 'vuex';
  export default {
    computed: mapGetters(['posts']),
    methods: {
      ...mapActions(['getAllPosts']),
    },
    created() {
      this.getAllPosts();
    }
  }
</script>