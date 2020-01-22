<template>
  <div class="home">
    <div class="card mt-2">
      <div class="card-header bg-secondary text-white">
        <h3>Recent Posts Uploads</h3>
      </div>
      <div class="card-body">
        <div class="row ">
          <div v-for="post in posts" :key="post.id" class="col-md-4 jumbotron">
            <div class="card-header">{{ post.postTitle }}</div>
            <div class="card-body"><!--post.image-->{{ post.postText }}</div>
            <div class="card-footer">
              {{ post.nickName }} {{ post.email }} {{ post.postDate }}
            </div>
            <router-link :to="'/postDetail/' + post.id"></router-link>
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

<style lang="css">
  .card-header {
    font-family: 'Bangers', cursive;
    font-size: 18pt;
    background-color: rgb(0,0,0,0.5);
  }

  .card-body {
    background: rgba(62, 191, 55, 1);
    background: -moz-linear-gradient(-45deg, rgba(62, 191, 55, 1) 0%, rgba(27, 163, 27, 1) 100%);
    background: -webkit-gradient(left top, right bottom, color-stop(0%, rgba(62, 191, 55, 1)), color-stop(100%, rgba(27, 163, 27, 1)));
    background: -webkit-linear-gradient(-45deg, rgba(62, 191, 55, 1) 0%, rgba(27, 163, 27, 1) 100%);
    background: -o-linear-gradient(-45deg, rgba(62, 191, 55, 1) 0%, rgba(27, 163, 27, 1) 100%);
    background: -ms-linear-gradient(-45deg, rgba(62, 191, 55, 1) 0%, rgba(27, 163, 27, 1) 100%);
    background: linear-gradient(135deg, rgba(62, 191, 55, 1) 0%, rgba(27, 163, 27, 1) 100%);
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#3ebf37', endColorstr='#1ba31b', GradientType=1);
    font-family: 'Lato', sans-serif;
    color: white;
  }

  .card-footer{
    color: rgb(0,0,0,0.5);
    background-color: transparent;
  }
</style>