<template>
  <v-app>
    <Header/>
    <v-content>
      <router-view/>
      <Alerts/>
    </v-content>
  </v-app>
</template>
<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { WebsocketModule } from "@/store/modules/websocket";
  import vkService from "@/services/vkService";
  import { AppModule } from "@/store/modules/app";
  import Header from "@/components/Header.vue";
  import Alerts from "@/components/Alerts.vue";

  @Component({
    components: {
      Header,
      Alerts
    }
  })
  export default class App extends Vue {
    // get title() {
    //   return "0.1.62 - " + (WebsocketModule.isAuth ? "auth" : "not auth");
    // }

    async initApp() {
      console.log('route.query', this.$route.query)
      const vkSign = this.$route.query.sign;
      const vkParams = {};
      Object.keys(this.$route.query)
        .sort()
        .forEach((key) => {
          // if (key.slice(0, 3) === "vk_") {
            vkParams[key] = this.$route.query[key];
          // }
        });

      vkService.init({ vkParams, vkSign }).catch(e => {
        if (AppModule.showLogs) console.error("vkService.init", e);
      });
      WebsocketModule.Init({ eventListener: this.$options["sockets"] });
    }

    // noinspection JSUnusedGlobalSymbols
    created(): void {
      this.initApp();
    }

    /*    get error() {
          return AlertsModule.error;
        }

        get message() {
          return AlertsModule.message;
        }

        closeError() {
          AlertsModule.clearError();
        }

        closeMessage() {
          AlertsModule.clearMessage();
        }*/
  }
</script>

<style lang="scss">
  @import "./assets/css/gradient-buttons.min.css";

  html {
    overflow-y: unset !important;
  }

  .v-snack__content {
    font-size: 25px;
    text-align: left;
    max-width: 500px;
  }
</style>
