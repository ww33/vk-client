<template>
  <v-container
    fluid
    class="dialog-cont main-content"
    :class="{ hidden: isActive }">
    <v-row no-gutters>
      <v-col cols="12">
        <h1
          v-if="isRomantic"
          class="view-title view-title_friends">
          Есть совпадения!
        </h1>
        <h1
          v-else
          class="view-title view-title_friends">
          Друзья нашлись!
        </h1>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="3">
        <h2
          v-if="isRomantic"
          class="set-title">
          Очень близко:
        </h2>
        <h2
          v-else
          class="set-title">
          Вот они:
        </h2>
        <v-row
          align="center"
          no-gutters
          class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">
              Доступно <br />сетов
            </h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">
              20
            </h4>
          </v-col>
        </v-row>
        <v-row
          align="center"
          no-gutters
          class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">
              Полных совпадений
            </h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">
              {{ overlapMembersFlat }}
            </h4>
          </v-col>
        </v-row>
<!--
        <v-row
          align="center"
          no-gutters
          class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">
              Из них онлайн
            </h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">
              2
            </h4>
          </v-col>
        </v-row>
-->
      </v-col>
      <v-col cols="8">
        <v-slide-group
          class="user-list-slide"
          show-arrows="true">
          <v-slide-item
            v-for="(userList, index) in matchMembers"
            :key="userList">
            <div class="user-item">
              <!--<span class="user-status offline"/>-->
              <div
                class="user-avatar"
                @click="dialogActive(index, false)">
                <img
                  v-if="userList.photo"
                  :src="userList.photo"
                  alt=""
                  class="user-avatar__img" />
                <img
                  v-else
                  src="@/assets/img/avatar_empty_128.jpg"
                  alt=""
                  class="user-avatar__img" />
              </div>
            </div>
          </v-slide-item>
        </v-slide-group>
        <div class="btn-custom-wrap">
          <v-btn
            v-if="!isRomantic"
            class="custom-btn"
            @click="goChat">
            Перейти в мэтч-видеочат
          </v-btn>
          <v-btn
            class="custom-btn"
            @click="dialogActive('all', false)">
            {{ isRomantic ? "Посмотреть все профили" : "Посмотреть профили в мэтче" }}
          </v-btn>
          <v-btn
            class="custom-btn"
            @click="goQuiz">
            Ответить на другой сет вопросов
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <!--:class="{  'justify-space-between' : isRomantic   }"-->
        <div class="d-flex quiz-nav-wrap align-center">
          <!--v-if="isRomantic"-->
          <div class="d-flex justify-start align-center">
            <h4
              v-if="overlapMembers.length > 0"
              class="quiz-title">
              Полностью совпали:
            </h4>
            <v-slide-group
              class="user-list-slide small-user-list"
              show-arrows="true">
              <v-slide-item
                v-for="(listUserCompare, index) in overlapMembers"
                :key="listUserCompare">
                <div class="user-item">
<!--                  <span class="user-status offline"></span>-->
                  <div
                    class="user-avatar"
                    @click="dialogActive(index, true)">
                    <img
                      v-if="listUserCompare.photo"
                      :src="listUserCompare.photo"
                      alt=""
                      class="user-avatar__img" />
                    <img
                      v-else
                      src="@/assets/img/avatar_empty_128.jpg"
                      alt=""
                      class="user-avatar__img" />
                  </div>
                </div>
              </v-slide-item>
            </v-slide-group>
          </div>
        </div>
      </v-col>
    </v-row>

    <!--
        <v-dialog
          v-model="dialog"
          hide-overlay
          transition="dialog-bottom-transition"
          class="user-popup"
          attach=".dialog-cont"
        >
          <v-btn
            color="primary"
            text
            @click="dialogActive('close')"
            class="user-popup__close-btn"
          >
          </v-btn>
          <v-carousel
            class="user-popup-carousel"
            height="600"
            >
            <v-carousel-item
              v-for="card in userObject"
              :key="card">
              <v-card>
                <v-row>
                  <v-col cols="4" class="relative">
                    <div class="avatar-popup-wrap">
                      <v-window
                        light="true"
                        v-model="window"
                      >
                        <v-window-item

                        >
                          <v-img
                            v-if="card.photo"
                            height="315"
                            max-width="315"
                            :src="card.photo"
                            class="user-popup__avatar"></v-img>
                          <v-img
                            v-else
                            height="315"
                            max-width="315"
                            src="/jpg/avatar_empty_128.jpg"
                            class="user-popup__avatar"></v-img>
                        </v-window-item>
                        <v-window-item

                        >
                          <v-img
                            v-if="card.photo"
                            height="392"
                            max-width="320"
                            :src="card.photo"
                            class="user-popup__avatar"></v-img>
                          <v-img
                            v-else
                            height="392"
                            max-width="320"
                            src="/jpg/avatar_empty_128.jpg"
                            class="user-popup__avatar"></v-img>
                        </v-window-item>
                      </v-window>
                      <v-item-group
                        v-model="window"
                        class="shrink-avatar mr-6"
                        mandatory
                        tag="v-flex"
                      >
                        <v-item
                          v-for="n in 2"
                          :key="n"
                          v-slot:default="{ active, toggle }"
                        >
                          <div>
                            <v-btn
                              :input-value="active"
                              icon
                              @click="toggle"
                            >
                              <v-icon>mdi-record</v-icon>
                            </v-btn>
                          </div>
                        </v-item>
                      </v-item-group>
                    </div>
                    <div class="coincidence">
                      <h4 class="coincidence__title">Совпадения</h4>
                      <v-list class="d-flex align-center coincidence__list" light>
                        <v-list-item>
                          <v-img v-if="true" max-width="40" src="/svg/category-1.svg"></v-img>
                          <v-img v-else max-width="40" src="/svg/romb-icon-disabled.svg"></v-img>
                        </v-list-item>
                        <v-list-item>
                          <v-img v-if="false" max-width="40" src="/svg/category-2.svg"></v-img>
                          <v-img v-else max-width="40" src="/svg/star-icon-disabled.svg"></v-img>
                        </v-list-item>
                        <v-list-item>
                          <v-img v-if="false" max-width="40" src="/svg/category-3.svg"></v-img>
                          <v-img v-else max-width="40" src="/svg/heart-icon-disabled.svg"></v-img>
                        </v-list-item>
                      </v-list>



                    </div>


                  </v-col>
                  <v-col cols="8">
                    <v-card-title class="user-popup__title">
                      <span v-if="card.first_name">{{card.first_name}}</span>
                      <span v-if="card.last_name">{{card.last_name}}</span>
                    </v-card-title>
                    <v-card-subtitle class="user-popup__title-age d-flex align-center justify-start">
                      <span>55 лет</span>
                    </v-card-subtitle>
                    <perfect-scrollbar class="scrollbar scroll-profile-text">
                      <v-card-text class="user-popup__text">
                        Каждый новый пользователь создает анкету в приложении, отвечая на 10 вопросов, созданных психологами:
                        например, «На ваш взгляд, за рулем должен быть только мужчина?» или «Дали бы вы смартфон в руки
                        ребенку?». Далее алгоритмы обрабатывают ответы, и мэтч происходит только если люди совместимы
                        психологически.
                      </v-card-text>
                    </perfect-scrollbar>
                    <a
                      @click="addToFavorites(card.user_token)"
                      href="#"
                      class="add-friends d-flex align-center">
                      <v-img
                        height="30"
                        max-width="34"
                        src="/svg/favorite-icon.svg"></v-img>
                      <span>Добавить в Избранные</span>
                    </a>
                    <a
                      href="#"
                      class="add-friends d-flex align-center">
                      <v-img
                        height="27"
                        max-width="27"
                        src="/svg/add-friends.svg"></v-img>
                      <span>Отправить запрос в друзья</span>
                    </a>
                  </v-col>
                </v-row>
              </v-card>
            </v-carousel-item>
          </v-carousel>

        </v-dialog>
    -->
    <ProfileViewer
      v-model="showProfileViewer"
      :user-object="userObject"
      :active="active" />
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { MatchModule } from "@/store/modules/match";
  import { SetsModule } from "@/store/modules/sets";
  import { FavoritesModule } from "@/store/modules/favorites";
  import ProfileViewer from "@/components/ProfileViewer.vue";

  @Component({
    components: { ProfileViewer }
  })
  export default class FriendsFound extends Vue {
    // window = 0;
    dialog = false;

    active = false;
    userObject = null;
    showProfileViewer = false;

    get matchToken() {
      return MatchModule.matchToken;
    }

    get overlapToken() {
      return MatchModule.overlapToken;
    }

    get matchMembers() {
      return MatchModule.matchMembersFlat;
    }

    get overlapMembers() {
      return MatchModule.overlapMembersFlat;
    }

    get isActive() {
      return this.active;
    }

    get isRomantic() {
      return SetsModule.currentSection === 2;
    }

    mounted() {
      setTimeout(() => {
        this.load();
      }, 0);
    }

    async load() {
      if (this.matchToken) {
        const params = { match_token: this.matchToken, commitMembers: true, includeCurrentUser: false };
        const { error, data: matchMembers } = await MatchModule.getMatchMembers(params);
        if (error) {
          console.error("getMatchMembers match_token", error);
        }
      }
      if (this.overlapToken) {
        const params = { overlap_token: this.overlapToken, commitMembers: true, includeCurrentUser: false };
        const { error, data: overlapMembers } = await MatchModule.getOverlapMembers(params);
        if (error) {
          console.error("getMatchMembers overlap_token", error);
        }
      }
    }

    dialogActive(id, overlap = false) {
      // this.dialog = true;
      if (id == "close") {
        this.dialog = false;
      } else if (id == "all") {
        if (overlap) {
          this.userObject = this.overlapMembers;
        } else {
          this.userObject = this.matchMembers;
        }
      } else {
        if (overlap) {
          this.userObject = [this.overlapMembers[id]];
        } else {
          this.userObject = [this.matchMembers[id]];
        }
      }
      this.active = this.userObject.length <= 1;
      this.showProfileViewer = true;
    }

    goChat() {
      this.$router.push("/friends-chat");
    }

    goQuiz() {
      this.$router.push("/start");
    }

    async addToFavorites(user_token) {
      const section = SetsModule.currentSection;
      const { error, data } = await FavoritesModule.addCandidate({ user_token, section });
      error ? console.error("addToFavorites ", error) : console.log("addToFavorites  ", data);
    }
  }
</script>

<style
  lang="scss"
  scoped>
  .coincidence__title {
    font-size: 14px;
    line-height: 1;
    font-weight: 400;
    color: #000000;
    padding-bottom: 13px;
  }

  .shrink-avatar {
    display: flex;
    align-items: center;
    padding: 20px 0;
    padding-left: 100px;

    .v-btn:not(.v-btn--text):not(.v-btn--outlined).v-btn--active:before {
      opacity: 1;
    }

    .v-btn:before {
      content: "";
      display: block;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #4690ff;
    }

    .v-item--active .v-btn:before {
      background: #4690ff;
    }
  }

  .user-popup-carousel {
    background: #fff;

    .v-carousel__controls {
      display: none;
    }

    .v-card {
      background: #fff;
      box-shadow: none;
    }
  }

  .scroll-profile-text {
    margin-bottom: 41px;
  }

  .coincidence__list {
    padding: 0;

    .v-list-item {
      padding: 0px;
      margin-right: 9px;
    }
  }

  .user-popup__close-btn {
    display: block;
    width: 50px !important;
    min-width: 50px !important;
    height: 50px !important;
    background: url(/svg/close-grey.svg) no-repeat center center;
    background-size: cover;
    position: absolute;
    right: 15px;
    top: 15px;
    z-index: 10;
    cursor: pointer;

    .v-btn__content {
      display: block;
    }
  }

  .scroll-profile-text {
    max-height: 136px;
  }

  .user-popup__title {
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    padding-bottom: 20px;

    span {
      display: block;
      font-size: 40px;
      color: #788ea8;
      line-height: 1;
      font-weight: 300;
    }
  }

  .add-friends {
    text-decoration: none;
    transition: opacity 0.3s;
    margin-bottom: 20px;

    &:hover {
      opacity: 0.7;
      transition: opacity 0.3s;
    }

    span {
      font-size: 14px;
      color: #000000;
      font-weight: 400;
      padding-left: 10px;
    }
  }

  .user-popup__text {
    font-size: 14px;
    line-height: 1.1;
    color: #000000;
    font-weight: 300;
    padding: 0;
    padding-right: 20px;
  }

  .user-popup__avatar {
    border-radius: 30px;
  }

  .user-popup__title-age {
    display: flex;
    margin-top: 0;
    margin-bottom: 15px;
    padding: 0;

    span {
      font-size: 22px;
      line-height: 1;
      color: #000000;
    }
  }

  .btn-back {
    font-weight: 700;
    font-size: 28px;
    text-align: center;
    color: #788ea8;
    display: block;
    padding: 0px 25px !important;
    border: 1px solid #788ea8;
    border-radius: 73px;
    cursor: pointer;
    outline: none;
    width: 190px;
    height: 47px;
    line-height: 47px;
  }

  .btn-custom-wrap {
    padding-left: 35px;
    padding-bottom: 108px;
  }

  .user-list-slide {
    margin-top: 10px;
    margin-bottom: 35px;
    max-width: 500px;
  }

  .user-item {
    position: relative;
    margin-right: 25px;
  }

  .user-avatar {
    display: block;
    width: 79px;
    height: 79px;
    border-radius: 50%;
    overflow: hidden;
    cursor: pointer;
    border: 1px solid gray;

    &__img {
      display: block;
      width: 100%;
      height: auto;
    }
  }

  .user-status {
    display: block;
    width: 16px;
    height: 16px;
    border: 2px solid #fff;
    position: absolute;
    right: 4px;
    top: 4px;
    z-index: 1;
    border-radius: 50%;

    &.online {
      background: #79d800;
    }

    &.offline {
      background: #ff0000;

      &:before {
        content: "";
        width: 10px;
        height: 1px;
        background: #fff;
        position: absolute;
        right: 1px;
        top: 5px;
        transform: rotate(45deg);
      }

      &:after {
        content: "";
        width: 10px;
        height: 1px;
        background: #fff;
        position: absolute;
        right: 1px;
        top: 5px;
        transform: rotate(-45deg);
      }
    }
  }

  .user-icon {
    display: block;
  }

  .quiz-title {
    font-size: 64px;
    color: $start-color;
    font-weight: 300;
    line-height: 1.2;
    padding-bottom: 60px;
  }

  .set-title {
    font-size: 37px;
    color: $start-color;
    font-weight: 300;
    line-height: 1;
    padding-bottom: 39px;
  }

  .quest-text {
    padding-top: 25px;
    font-weight: 400;
    font-size: 30px;
    line-height: 37px;
    padding-bottom: 30px;
    color: $black;
  }

  .quiz-nav-wrap {
    .quiz-title {
      padding-bottom: 0;
      font-size: 33px;
      padding-right: 25px;
    }
  }

  .user-popup-carousel {
    .v-carousel__controls {
      background: transparent !important;
    }

    .v-carousel__controls .v-btn:before {
      background: #4690ff;
    }
  }

  .avatar-popup-wrap {
    position: relative;
    margin-left: -100px;
    z-index: 100;
  }

  .v-dialog {
    overflow: unset;
  }
</style>
