<template>
  <div>
    <h3 id="textContent">You've been disconnected</h3>
  </div>
</template>

<script>
export default {
  async created() {
    this.$store.state.profile = {};
    this.$store.state.authorization = "";
    localStorage.clear();
    setTimeout(() => {
      this.$router.push("/");
    }, 1000);
  }
};
</script>

<style>
#textContent {
  font-family: "Sedgwick Ave", cursive;
}
</style>
