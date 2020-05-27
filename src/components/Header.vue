<template>
  <div>
    <v-container
      class="header-container"
      fluid>
      <v-toolbar
        color="#f8f8f8"
        dense>
        <v-btn
          v-show="showBtnBack"
          class="v-btn"
          width="32"
          height="32"
          icon
          @click="goBack">
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <v-btn
          icon
          small
          class="v-btn mx-2"
          @click="goHome">
          <v-icon>mdi-home</v-icon>
        </v-btn>
        <h5 class="version-text">
          {{ version }} {{ isAuth ? "Auth" : "Auth Error!" }}
        </h5>
        <v-spacer/>
        <div v-if="showTestButtons">
          <v-btn
            icon
            small
            @click="goPro(3)">
            <v-icon color="grey">
              mdi-professional-hexagon
            </v-icon>
          </v-btn>
        </div>
        <v-badge
          class="link-events"
          :value="animatedNumber > 0"
          :content="animatedNumber"
          offset-y="8"
          offset-x="1">
          <a
            @click.prevent="goEvents">
            События
          </a>
        </v-badge>
        <a
          class="link-events"
          @click.prevent="goFavorites">
          <v-icon color="primary">
            mdi-account-plus
          </v-icon>
          Избранные
        </a>
        <a
          class="link-events mx-2"
          @click="goProfile">
          <v-icon color="primary">
            mdi-account-circle
          </v-icon>
          {{ currentUser && currentUser.nickname !== "" ? currentUser.nickname : "Мой профиль" }}
        </a>
      </v-toolbar>
    </v-container>
  </div>
</template>

<script lang="ts">

  import {Component, Vue, Watch} from "vue-property-decorator";
  import {gsap} from "gsap";
  import {UserModule} from "@/store/modules/user";
  import {WebsocketModule} from "@/store/modules/websocket";
  import {SetsModule} from "@/store/modules/sets";
  import {MatchModule} from "@/store/modules/match";
  import {AppModule} from "@/store/modules/app";
  import {AlertsModule} from "@/store/modules/alerts";
  import {FavoritesModule} from "@/store/modules/favorites";
  import vkService from '@/services/vkService'

  @Component
  export default class Header extends Vue {
    version = "v 0.2.50";

    get showTestButtons() {
      return true
      // return AppModule.isDevelopment;
    }

    async goPro() {

/*      fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'foo',
          body: 'bar',
          userId: 1
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        }
      })
        .then(response => response.json())
        .then(json => console.log(json))*/


      // this.goFriendsFound()
      // AlertsModule.testInvites();

      const {error, data} = await vkService.friendsSync();
      console.log('friendsSync', {error, data})
    }

    get eventsCount() {
      return FavoritesModule.eventsCount;
    }

    get isAuth() {
      return WebsocketModule.isAuth;
    }

    get title() {
      if (this.$route.meta && this.$route.meta.title) {
        return this.$route.meta.title;
      } else {
        return "КУ!";
      }
    }

    get showBtnBack() {
      return !(this.$route.path === "/");
    }

    get currentUser() {
      return UserModule.currentUser;
    }


    async goHome() {
      // const res = await SetsModule.ping()
      // console.log(res)
      this.$router.push("/");
    }

    goProfile() {
      if (WebsocketModule._isUserRegistered) {
        this.$router.push("/profile-edit");
      } else {
        this.$router.push("/profile");
      }
    }

    goBack() {
      const currentRoute = this.$route.path;
      switch (currentRoute) {
        case "/friends-found":
          this.$router.push("/start");
          break;
        default:
          this.$router.go(-1);
      }
    }

    goFriendsFound(section = 3) {
      SetsModule.SET_CURRENT_SECTION(section);
      const match_token = "20-04-04:3:2:111:1";
      const overlap_token = "f:20-04-04:3:2:11111";
      MatchModule.SET_MATCH_TOKEN(match_token);
      MatchModule.SET_OVERLAP_TOKEN(overlap_token);
      this.$router.push("/friends-found");
    }

    goEvents() {
      this.$router.push("/events");
    }

    goFavorites() {
      this.$router.push("/favorites");
    }

    tweenedNumber = 0;

    get animatedNumber() {
      return this.tweenedNumber.toFixed(0);
    }

    @Watch("eventsCount", {immediate: true, deep: true})
    onNumberChanged(val: number, oldVal: number) {
      gsap.to(this.$data, {duration: 1.5, tweenedNumber: this.eventsCount});
      gsap.from(".v-chip", {scale: 1.5});
      gsap.to(".v-chip", {scale: 1});
    }
  }
</script>

<style
  lang="scss"
  scoped>

  .header-container {
    padding: 0;
    position: relative;
    z-index: 10;

    .v-toolbar {
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
      padding: 0 35px;
    }
  }

  .v-btn {
    color: $primary_color !important;
  }

  .version-text {
    margin-left: 15px;
    color: rgba(93, 96, 98, 0.24);
    font-size: 75%;
  }


  .link-events {
    > :hover {
      color: $primary_color;
    }

    margin: 0 20px;
    font-size: 90%;
    text-decoration: none;
    color: black;
    user-select: none;

    a {
      color: black;
    }
  }

  .link-events:hover {
    color: $primary_color;
  }
</style>

<style lang="scss">
  .link-events {
    .v-badge__wrapper span {
      font-size: 7pt;
      border-radius: 10px;
      padding: 3px 4px;
      height: 15px;
      min-width: 15px;
    }
  }
</style>
