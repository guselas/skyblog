<template>
  <div>
    <h1>{{ msg }}</h1>

    <h2>Login</h2>

    <form id="loginForm">
      <div class="form-group">
        <label for="exampleInputEmail1">Email address</label>
        <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
      </div>
      <div class="form-group">
        <label for="exampleInputPassword1">Password</label>
        <input type="password" class="form-control" id="exampleInputPassword1">
      </div>

      <div class="form-group">
        <button type="submit" class="btn btn-danger">Cancel</button>
        <button type="submit" class="btn btn-primary">Sign In</button>
      </div>
    
    </form>
  </div>
</template>

<script>
  export default {
    name: 'Login',
    props: {
      msg: String
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .form-group {
    width: 50%;
    margin: 0 auto;
  }

  .form-group input {
    border: 1pt solid black;
    width: 25%;
    margin-left: 5px;
    display: inline;
    text-align: right;
    margin-bottom: 10px;
  }

  .form-group label {
    width: 15%;
    text-align: left;
  }
</style>