import Vue from "vue";
import App from "./App.vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import router from "./router";
import store from "./store";
import axios from "axios";

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

let appVue = new Vue({
  router,
  store,
  showModal: false,

  async created() {
    if (localStorage["authorization"]) {
      let payload = {
        Authorization: localStorage["authorization"]
      };
      this.$store.commit("setAuthorization", payload);
      let profileResponse = await axios.get(
        "http://localhost:3000/api/blog/profile",
        {
          headers: {
            Authorization: localStorage["authorization"]
          }
        }
      );
      await this.$store.dispatch("setProfile", profileResponse.data);
    }
  },

  render: h => h(App)
}).$mount("#app");

axios.interceptors.request.use(
  config => {
    if (appVue.$store.state.authorization) {
      config.headers["Authorization"] = appVue.$store.state.authorization;
    }
    return config;
  },
  error => {
    Promise.reject(error);
  }
);
