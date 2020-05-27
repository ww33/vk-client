<template>
  <v-container fluid class="main-content">
    <v-row
      no-gutters
      style="margin-top: 20px;">
      <h1
        class="view-title">
        Хочется...
      </h1>
    </v-row>
    <v-row class="card-wrap">
      <v-col cols="4">
        <span class="card-title">
          Подружиться
        </span>
        <v-card
          hover
          height="100%"
          class="card-outter"
          @click="startQuest(1)">
          <img
            class="avatar"
            src="@/assets/svg/section-1.svg"
            alt="Handshaker"
            rel="preload"/>
          <v-card-title
            primary-title
            class="d-flex flex-column section-title">
            Handshaker
          </v-card-title>
          <v-card-text class="section-text">
            Здесь можно найти группу <br />
            единомышленников
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <span class="card-title">
          Влюбиться
        </span>
        <v-card
          hover
          height="100%"
          class="card-outter"
          @click="startQuest(2)">
          <img
            class="avatar"
            src="@/assets/svg/section-2.svg"
            alt="Romantic"
            rel="preload"/>
          <v-card-title
            primary-title
            class="d-flex flex-column section-title">
            Romantic
          </v-card-title>
          <v-card-text class="section-text">
            Если грустно и одиноко, <br />
            можно зайти сюда <br />
            и найти себе пару
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="4">
        <span class="card-title">
          Поболтать
        </span>
        <v-card
          hover
          height="100%"
          class="card-outter"
          @click="startQuest(3)">
          <img
            class="avatar"
            src="@/assets/svg/section-3.svg"
            alt="Nonsense"
            rel="preload"/>
          <v-card-title
            primary-title
            class="d-flex flex-column section-title">
            Nonsense
          </v-card-title>
          <v-card-text class="section-text">
            Не знаешь, кого ищешь?<br />
            Просто скучно? Тебе сюда!
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { SetsModule } from "@/store/modules/sets";
  import { AppModule } from "@/store/modules/app";
  import { AlertsModule } from "@/store/modules/alerts";

  @Component
  export default class Start extends Vue {
    get showTestButtons() {
      return AppModule.isDevelopment;
    }

    async startQuest(section) {
      const { error, data } = await SetsModule.getCurrentSet(section);
      if (error) {
        if (AppModule.isDevelopment) console.error(error);
      } else {
        if (data.hasOwnProperty("day_closed")) {
          AlertsModule.SET_MESSAGE("Тут сегодня вопросы закончились, попробуйте в другом разделе!");
        } else {
          await this.$router.push(`/quiz/${section}`);
        }
      }
    }
  }
</script>

<style
  lang="scss"
  scoped>
  .intro-logo-wrap
  .card-wrap {
    max-width: 1240px;
    margin: 0 auto 20px;
  }

  .card-title {
    font-size: 25px;
    font-family: Montserrat, sans-serif;
    margin: 0 10px;
    color: $start-color;
  }

  .card-outter {
    padding: 10px 0;
    position: relative;
    text-align: center;
    border-radius: 20px !important;
    margin-left: 10px;
    margin-right: 10px;
  }

  .avatar {
    width: 100%;
    padding: 20px;
  }

  .main-title {
    color: $start-color;
    font-weight: 300;
    font-size: 25pt;
  }

  .section-title {
    font-weight: 300;
    color: $start-color;
    font-size: 27px;
    padding-bottom: 10px;
    text-align: center;
  }

  .section-text {
    font-family: Montserrat, sans-serif;
    font-size: 12px;
    color: $start-color;
    line-height: 16px;
    display: block;
    text-align: center;
    word-break: keep-all;
  }
</style>
