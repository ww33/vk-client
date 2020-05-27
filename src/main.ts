import Vue from "vue";

Vue.config.productionTip = false;
Vue.config.silent = true;

import "@mdi/font/css/materialdesignicons.css";
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
import VueNativeSock from "vue-native-websocket";
import VueProgressiveImage from "vue-progressive-image";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VuetifyDialogPromise from "vuetify-dialog-promise";
import linkify from "vue-linkify";

import App from "./App.vue";
import router from "./router";
import store from "@/store";

Vue.use(VueNativeSock, "wss://meetup.inachi.eu:4430/ws", {
  connectManually: true,
  // reconnection: true, // (Boolean) whether to reconnect automatically (false)
  // reconnectionAttempts: 500, // (Number) number of reconnection attempts before giving up (Infinity),
  // reconnectionDelay: 1000, // (Number) how long to initially wait before attempting a new (1000)
  format: "json"
});

Vue.use(VuetifyDialogPromise, {
  locale: "ru"
});

const vm = new Vue();
vm.$connect();

Vue.use(Vuetify);
Vue.use(VueProgressiveImage);
Vue.use(PerfectScrollbar);
Vue.directive("linkified", linkify);

new Vue({
  router,
  store,
  vuetify: new Vuetify({
    icons: {
      iconfont: "mdi" // default - only for display purposes
    },
    theme: {
      themes: {
        light: {
          primary: "#31A6FC"

          /*
          primary: "#4080CB",
          secondary: "#FF0000",
          accent: "#0000FF"
          */
        }
      },
      options: {
        customProperties: true
      }
    }
  }),
  render: (h): any => h(App)
}).$mount("#app");
