import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../components/Home.vue";
import Register from "../components/Auth/Register";
import Login from "../components/Auth/Login";
import PostDetail from "../components/PostDetail";
import Profile from "../components/Auth/Profile";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/postdetail",
    name: "postDetail",
    component: PostDetail
  },
  {
    path: "/login",
    name: "login",
    component: Login
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
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
