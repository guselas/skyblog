import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Register from "../components/Auth/Register";
import Login from "../components/Auth/Login";
import LogOut from "../components/Auth/LogOut";
import PostDetail from "../components/PostDetail";
import Profile from "../components/Auth/Profile";
import MyPosts from "../components/MyPosts";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/postdetail/:id",
    name: "postDetail",
    component: PostDetail
  },
  {
    path: "/login",
    name: "login",
    component: Login
  },
  {
    path: "/logout",
    name: "logout",
    component: LogOut
  },
  {
    path: "/register",
    name: "register",
    component: Register
  },
  {
    path: "/profile",
    name: "profile",
    component: Profile
  },
  {
    path: "/myposts",
    name: "myposts",
    component: MyPosts
  },

];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
