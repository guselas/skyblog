<template> 
<div>
    <h3>You've been disconnected</h3>
</div>
</template>

<script>
export default {
  async created() {
    this.$store.state.profile = {};
    this.$store.state.authorization = "";
    setTimeout(() => {
            this.$router.push("/");
    }, 1500);
  }
};
</script>

<style></style>
