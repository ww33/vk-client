<template>
  <v-container class="main-content" fluid>
    <v-row no-gutters>
      <v-col
        cols="8"
        class="intro-left">
        <div class="intro-logo-wrap d-flex align-center justify-start">
          <h1 class="intro-logo">
            Кто <span>удалился?</span>
          </h1>
        </div>
      </v-col>
      <v-col
        cols="4"
        class="intro-right">
        <v-row align="center" no-gutters class="result-row">
          <v-col>
            <h3 class="set-result-title">
              Удалилось
            </h3>
          </v-col>
          <v-col>
            <h4 class="set-result-coin">
              {{ removedFriendsCount }}
            </h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="result-row">
          <v-col>
            <h3 class="set-result-title">
              Добавилось
            </h3>
          </v-col>
          <v-col>
            <h4 class="set-result-coin">
              {{ addedFriendsCount }}
            </h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="result-row">
          <v-col>
            <h3 class="set-result-title">
              Добавилось <br> через КУ!
            </h3>
          </v-col>
          <v-col>
            <h4 class="set-result-coin">
              {{ addedFromKu }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <button
              class="now-friends-btn custom-btn"
              @click="goList">
              Узнай о своих друзьях!
            </button>
            <h3 class="find-new-title">
              Как это<br> удалились?
            </h3>
            <button
              class="find-new-btn"
              @click="goStart">
              Найди новых!
            </button>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <button @click="onChat">
        Чат
      </button>
<!--
      <router-link :to="'profile'">
        Профиль
      </router-link>
-->
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator";
  import {UserModule} from "@/store/modules/user";
  import {VkModule} from "@/store/modules/vk";

  @Component
  export default class Home extends Vue {

    get currentUser() {
      return UserModule.currentUser;
    }

    get removedFriendsCount() {
      return VkModule.removedFriendsCount
    }

    get addedFriendsCount() {
      return VkModule.addedFriendsCount
    }

    get addedFromKu() {
      return VkModule.addedFromKu
    }

    onChat() {
      this.$router.push("friends-chat");
    }

    goList() {
      this.$router.push("/history");
    }

    goStart() {
      if (this.currentUser.nickname === "") {
        this.$router.push("/profile");
      } else {
        this.$router.push("/start");
      }
    }
  }
</script>


<style
  lang="scss"
  scoped>
  @import url("https://fonts.googleapis.com/css2?family=Montserrat+Alternates:wght@700&display=swap");

  .intro-left {
    //noinspection CssUnknownTarget
    background: url("~@/assets/img/intro-bg.png") no-repeat center center;
    background-size: 100%;
    padding-top: 20px;
  }

  .intro-right {
    padding-top: 75px;
    padding-left: 20px;
  }

  .find-new-btn {
    line-height: 50px;
    height: 50px;
    width: 100%;
    padding: 0 25px !important;
    font-weight: 500;
    font-size: 18px;
    text-align: center;
    color: #FFFFFF;
    background: linear-gradient(142.94deg, #FFB95A 24.88%, #F7D660 84.57%);
    border-radius: 145px;
    max-width: 270px;
    outline: none;
  }

  .find-new-title {
    font-size: 28px;
    line-height: 100.4%;
    color: #788EA8;
    font-weight: 300;
    padding-bottom: 15px;
  }

  .now-friends-btn {
    margin-bottom: 50px;
    width: 100%;
    max-width: 270px;
  }


  .logo {
    margin-left: 40px;
    margin-top: 20px;
  }

  .caption2 {
    color: $header-color;
    font-size: 20px;
  }


  h1 {
    color: $primary_color;
  }

  .intro-logo {
    font-weight: 700;
    font-size: 66px;
    color: #000000;
    font-family: 'Montserrat Alternates', sans-serif;
    line-height: 39px;

    span {
      display: block;
      font-size: 32px;

    }
  }

  .intro-logo-wrap {
    &:before {
      content: '';
      display: block;
      width: 88px;
      height: 88px;
      background: url("~@/assets/img/main-logo.svg") no-repeat center center;
      background-size: cover;
      margin-right: 25px;
    }
  }

</style>
