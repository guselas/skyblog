<template>
  <form style="display:inline">
    <img src="./assets/facebook.png" />
    <img src="./assets/googleplus.png" />
    <img src="./assets/twitter.png" />
    <img src="./assets/instagram.png" />
    <img src="./assets/pinterest.png" />
    <img src="./assets/github.png" />
  </form>
</template>

<script>
export default {
  name: "SocialMedia",
  props: {}
};
</script>

<style scoped>
form img {
  height: 35px;
  margin: 0 10px;
}

form {
  position: fixed;
  bottom: 0;
  right: 45%;
}
</style>
