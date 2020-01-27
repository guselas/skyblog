<template>
  <form style="display:inline">
    <a target="_blank" href="https://es-es.facebook.com/"
      ><img src="./assets/facebook.png"
    /></a>
    <a target="_blank" href="https://aboutme.google.com/"
      ><img src="./assets/googleplus.png"
    /></a>
    <a target="_blank" href="https://twitter.com/"
      ><img src="./assets/twitter.png"
    /></a>
    <a target="_blank" href="https://www.instagram.com"
      ><img src="./assets/instagram.png"
    /></a>
    <a target="_blank" href="https://www.pinterest.ca"
      ><img src="./assets/pinterest.png"
    /></a>
    <a target="_blank" href="https://github.com/"
      ><img src="./assets/github.png"
    /></a>
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
  padding-top: 10px;
}
</style>
