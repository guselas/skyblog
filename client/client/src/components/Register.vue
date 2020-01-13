<template>

    <form>
        <h2>Register</h2>

        <div class="form-group">
            <label for="exampleInputEmail1">Email address</label>
            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
        </div>

        <div class="form-group">
            <label>Nick Name</label>
            <input type="text" class="form-control" id="nickNameInput">
        </div>

        <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" id="passwordInput">
        </div>

        <div class="form-group">
            <label for="exampleInputPassword1">Confirm Password</label>
            <input type="password" class="form-control" id="confirmPasswordInput">
        </div>
        <div class="form-group">
            <button type="submit" id="cancelBtn" class="btn btn-danger">Cancel</button>
            <button type="submit" class="btn btn-primary">Register</button>
        </div>
    </form>

</template>

<script>
    export default {
        name: 'Register',
        props: {}
    }
</script>

<style>
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