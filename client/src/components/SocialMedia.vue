<template>
  <div>
    <form style="display:inline">
      <a target="_blank" href="https://es-es.facebook.com/"
        ><img src="./assets/SocialMediaIcons/facebook.png"
      /></a>
      <a target="_blank" href="https://aboutme.google.com/"
        ><img src="./assets/SocialMediaIcons/googleplus.png"
      /></a>
      <a target="_blank" href="https://twitter.com/"
        ><img src="./assets/SocialMediaIcons/twitter.png"
      /></a>
      <a target="_blank" href="https://www.instagram.com"
        ><img src="./assets/SocialMediaIcons/instagram.png"
      /></a>
      <a target="_blank" href="https://www.pinterest.ca"
        ><img src="./assets/SocialMediaIcons/pinterest.png"
      /></a>
      <a target="_blank" href="https://github.com/"
        ><img src="./assets/SocialMediaIcons/github.png"
      /></a>
    </form>
  </div>
</template>

<script>
export default {
  name: "SocialMedia",
  props: {}
};
</script>

<style scoped>
div {
  background-color: white;
  height: 35px;
  /* Safari */
  position: sticky;
  bottom: 0;
}
form img {
  height: 35px;
  margin: 0 15px;
  padding-top: 10px;
  position: -webkit-sticky;
  /* Safari */
  position: sticky;
  bottom: 0;
}
</style>
