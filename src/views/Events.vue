<template>
  <v-container
    class="dialog-cont hidden main-content"
    fluid>
    <v-row no-gutters>
      <h1 class="screen-title">
        События в Handshaker и Nonsense
      </h1>
    </v-row>
    <v-row class="screen-row">
      <v-col
        cols="3"
        class="screen-row__left">
        <v-row
          align="center"
          no-gutters
          class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">
              Запросов в избранные
            </h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">
              {{ requests }}
            </h4>
          </v-col>
        </v-row>
        <v-row
          align="center"
          no-gutters
          class="set-result-row">
          <!--
                    <v-col cols="7">
                      <h3 class="set-result-title">
                        В них новых <br>
                        сообщений
                      </h3>
                    </v-col>
          -->
          <!--
                    <v-col cols="5">
                      <h4 class="set-result-coin">
                        8
                      </h4>
                    </v-col>
          -->
        </v-row>
        <v-row>
          <v-btn
            class="custom-btn match-btn match-btn_star"
            @click="goChat(1)">
            Мэтчи в
            <img
              src="@/assets/svg/category-1.svg"
              width="30"
              class="ml-3"
              alt="Handshake" />
          </v-btn>
          <v-btn
            class="custom-btn match-btn match-btn_romb"
            @click="goChat(3)">
            Мэтчи в
            <img
              src="@/assets/svg/category-3.svg"
              width="30"
              class="ml-3"
              alt="Nonsense" />
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="9">
        <div class="list-table-title">
          <div class="list-table-title__col-0 list-table-title-col" />
          <div class="list-table-title__col-1 list-table-title-col" />
          <div class="list-table-title__col-3 list-table-title-col">
            <span>Тема</span>
          </div>
          <div class="list-table-title__col-4 list-table-title-col">
            <span>Совпадение</span>
          </div>
          <div class="list-table-title__col-5 list-table-title-col">
            <span>Добавить</span>
          </div>
          <div class="list-table-title__col-6 list-table-title-col">
            <span>Добавили</span>
          </div>
        </div>
        <perfect-scrollbar
          class="scrollbar users-list"
          options="">
          <v-list class="list">
            <v-list-item
              v-for="(user, index) in candidates"
              :key="user">
              <v-card>
                <v-row class="d-flex flex-no-wrap align-center justify-space-between">
                  <div
                    class="users-list__avatar"
                    @click="openProfile(user.profile)">
                    <v-avatar
                      size="40">
                      <v-img
                        v-if="user.photo"
                        :src="user.photo" />
                    </v-avatar>
                  </div>
                  <div
                    class="d-flex flex flex-column users-list__name"
                    @click="openProfile(user.profile)">
                    <v-card-title class="card-first-name">
                      {{ printName(user.profile) }}
                    </v-card-title>
                    <small class="last-online">
                      {{ user.setDate }}
                    </small>
                  </div>
                  <div
                    class="users-list__heart">
                    <img
                      :src="require('@/assets/svg/category-'+user.section+'.svg')"
                      alt=""
                      class="category-img" />
                  </div>
                  <div class="users-list__compare d-flex justify-center">
                    <span v-if="user.is_overlap === true">Полное</span>
                    <span v-else-if="user.is_overlap">Близко</span>
                  </div>
                  <div class="users-list__add d-flex justify-center">
                    <input
                      :id="index"
                      v-model="user.iChose"
                      :disabled="user.iChose"
                      type="checkbox"
                      class="add-check-item"
                      @change.prevent="confirmUser(user)"/>
                    <label
                      :for="index"
                      class="add-check-label">
                    </label>
                  </div>
                  <div class="users-list__add-status check d-flex justify-center">
                    <span
                      v-if="user.meChose"
                      class="add-status-icon" />
                    <span
                      v-else
                      class="add-status-none">
                      -
                    </span>
                  </div>
                </v-row>
              </v-card>
            </v-list-item>
          </v-list>
        </perfect-scrollbar>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <h2 class="screen-title l-top">
        События в Romantic
      </h2>
    </v-row>
    <v-row class="screen-row">
      <v-col
        cols="3"
        class="screen-row__left">
        <!--
                <v-row
                  align="center"
                  no-gutters
                  class="set-result-row">
                  <v-col cols="7">
                    <h3 class="set-result-title">
                      Пригласили в<br>
                      мэтчи
                    </h3>
                  </v-col>
                  <v-col cols="5">
                    <h4 class="set-result-coin">
                      12
                    </h4>
                  </v-col>
                </v-row>
                <v-row
                  align="center"
                  no-gutters
                  class="set-result-row">
                  <v-col cols="7">
                    <h3 class="set-result-title">
                      Подтвердили<br>
                      запросы в<br>
                      мэтчи
                    </h3>
                  </v-col>
                  <v-col cols="5">
                    <h4 class="set-result-coin">
                      8
                    </h4>
                  </v-col>
                </v-row>
        -->
      </v-col>
      <v-col cols="9">
        <div class="list-table-title">
          <div class="list-table-title__col-0 list-table-title-col" />
          <div class="list-table-title__col-1 list-table-title-col" />
          <div class="list-table-title__col-3 list-table-title-col">
            <span>Тема</span>
          </div>
          <div class="list-table-title__col-4 list-table-title-col">
            <span>Совпадение</span>
          </div>
          <div class="list-table-title__col-5 list-table-title-col">
            <span>Добавить</span>
          </div>
          <div class="list-table-title__col-6 list-table-title-col">
            <span>Добавили</span>
          </div>
        </div>
        <perfect-scrollbar class="scrollbar users-list users-list_romantic">
          <v-list class="list">
            <v-list-item
              v-for="(user, index) in candidatesRomantic"
              :key="user">
              <v-card>
                <div class="d-flex flex-no-wrap align-center">
                  <div class="users-list__avatar"
                       @click="openProfile(user.profile)">
                    <v-avatar
                      class="users-list__avatar"
                      size="40">
                      <v-img
                        v-if="user.photo"
                        :src="user.photo" />
                    </v-avatar>
                  </div>
                  <div class="d-flex flex flex-column users-list__name"
                       @click="openProfile(user.profile)">
                    <v-card-subtitle
                      class="card-first-name">
                      {{ printName(user.profile) }}
                    </v-card-subtitle>
                    <small class="last-online">
                      {{ user.setDate }}
                    </small>
                  </div>
                  <div class="users-list__heart">
                    <img
                      src="@/assets/svg/category-2.svg"
                      alt=""
                      class="category-img">
                  </div>
                  <div class="users-list__compare d-flex justify-center">
                    <span v-if="user.is_overlap === true">Полное</span>
                    <span v-else-if="user.is_overlap">Близко</span>
                  </div>
                  <div class="users-list__add d-flex justify-center">
                    <input
                      :id="index+'r'"
                      v-model="user.iChose"
                      :disabled="user.iChose"
                      type="checkbox"
                      class="add-check-item"
                      @change.prevent="confirmUser(user)">
                    <label
                      :for="index + 'r'"
                      class="add-check-label" />
                  </div>
                  <div class="users-list__add-status check d-flex justify-center">
                    <span
                      v-if="user.meChose"
                      class="add-status-icon" />
                    <span
                      v-else
                      class="add-status-none">
                      -
                    </span>
                  </div>
                </div>
              </v-card>
            </v-list-item>
          </v-list>
        </perfect-scrollbar>
      </v-col>
    </v-row>
    <ProfileViewer
      v-model="showProfileViewer"
      :user-object="userObject"
      :active="active" />
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { FavoritesModule } from "@/store/modules/favorites";
  import ProfileViewer from "@/components/ProfileViewer.vue";
  import { getPrintableName } from "@/lib/utils";
  import { parseHex } from "vuetify/src/util/colorUtils";

  @Component({
    components: { ProfileViewer }
  })
  export default class Events extends Vue {
    active = false;
    userObject = null;
    showProfileViewer = false;

    printName(profile) {
      return getPrintableName(profile);
    }

    created() {
      FavoritesModule.getCandidates().catch(e => console.error(e));
    }

    get candidates() {
      return FavoritesModule.candidates;
    }

    get requests() {
      return FavoritesModule.requestsCount;
    }


    get candidatesRomantic() {
      return FavoritesModule.candidatesRomantic;
    }

    async confirmUser(user) {
      const { user_token, section } = user;
      const { error, data } = await FavoritesModule.confirmUser({ user_token, section });
      if (!error && user.iChose === true && user.iChose === true) {
        FavoritesModule.removeCandidate({user_token, vue: this});
      }
    }

    goChat(section) {
      this.$router.push({
        name: "friends-chat",
        params: {
          section: section
        }
      });
    }

    openProfile(profile) {
      console.log("openProfile", profile);
      const { first_name, last_name, nickname, photo, user_token } = profile;
      this.userObject = [{ first_name, last_name, nickname, photo, user_token }];
      console.log("events userObject", this.userObject);
      this.active = this.userObject.length <= 1;
      this.showProfileViewer = true;
    }
  }
</script>


<style
  lang="scss"
  scoped>
  .category-img {
    max-width: 30px;
  }

  .set-result-title {
    font-size: 14px;
  }

  .match-btn {
    margin-bottom: 20px;
    width: 100%;
    max-width: 165px;
    border-radius: 73px;
    font-size: 20px;
    font-weight: 600;
    text-align: left;
    padding: 0 !important;
  }

  .screen-row__left {
    padding-top: 25px;
    padding-left: 28px;
  }

  .list-table-title-col {
    display: flex;
    justify-content: center;
    padding-bottom: 5px;

    span {
      font-size: 14px;;
      text-align: center;
      color: #D5D5D5;
      font-weight: 700;
    }
  }

  .list-table-title {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 15px;
    padding-right: 29px;


  }

  .list-table-title__col-0 {
    width: 40px;
    min-width: 40px;
  }

  .list-table-title__col-1 {
    padding-left: 16px;
    width: 33%;
    max-width: 33%;
  }

  .list-table-title__col-3 {
    width: 10%;
  }

  .list-table-title__col-4 {
    width: 16%;
  }

  .list-table-title__col-5 {
    width: 17%;
  }

  .list-table-title__col-6 {
    width: 14%;
  }

  .screen-row {
    background: #F1F1F1;
    border-radius: 20px;
  }

  .screen-title {
    font-size: 40px;
    font-weight: 400;
    color: #788EA8;
    line-height: 1;
    padding-bottom: 15px;
  }

  .l-top {
    padding-top: 33px;
  }

  .add-check-item {
    display: none;

    &:checked + .add-check-label {
      &:before {
        background: #4690FF;
        transition: all 0.3s;
      }

      &:after {
        content: '';
        transform: translateX(17px);
        transition: all 0.3s;
      }
    }
  }

  .add-check-label {
    position: relative;
    cursor: pointer;

    &:before {
      content: '';
      display: block;
      width: 45px;
      height: 27px;
      background: #EEEEEE;
      box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 0.1);
      border-radius: 95px;
      transition: all 0.3s;
    }

    &:after {
      content: '';
      display: block;
      width: 23px;
      height: 23px;
      background: #FFFFFF;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
      border-radius: 49px;
      position: absolute;
      left: 3px;
      top: 2px;
      transition: all 0.3s;
    }
  }

  .last-online {
    font-size: 13px;
    font-weight: 700;
    color: #949494;
  }

  .card-first-name {
    padding: 0;
    font-size: 15px;
    line-height: 28px;
    color: #2A5885 !important;
    font-weight: 700;
    height: 28px;
    overflow: hidden;

  }

  .add-status-icon {
    display: none;
    width: 26px;
    height: 19px;
    background: url('/svg/add-status-icon.svg') no-repeat center center;
    background-size: cover;
  }


  .users-list {
    max-height: 250px;

    &_romantic {
      max-height: 165px;
    }

    .v-list {
      padding-right: 10px;
    }

    &__heart {
      width: 10%;
      display: flex;
      justify-content: center;
    }

    &__name {
      padding-left: 16px;
      width: 33%;
      max-width: 33%;
    }

    &__avatar {
      width: 10%;
      display: flex;
      justify-content: center;
    }

    &__compare {
      width: 16%;

      span {
        color: #4690FF;
        font-weight: 700;
        font-size: 15px;
      }
    }

    &__add {
      width: 17%;

    }

    &__add-status {
      width: 14%;

      .add-status-none {
        display: block;
        color: #D5D5D5;
        font-size: 14px;
        font-weight: 700;
      }

      &.check {
        .add-status-icon {
          display: block;
        }

        .add-status-none {
          display: none;
        }
      }

    }

    .v-card {
      width: 100%;
      border-radius: 20px;
      padding: 10px 15px;
    }

    .v-list-item {
      width: 100%;
    }

    .v-list-item {
      margin-bottom: 15px;
    }

    .v-list, .v-sheet {
      background: transparent;

      &.v-card {
        background: #fff;
      }
    }
  }


</style>
