<template>
  <v-dialog
    v-model="show"
    hide-overlay
    transition="dialog-bottom-transition"
    class="user-popup"
    attach=".dialog-cont">
    <v-btn
      color="primary"
      text
      class="user-popup__close-btn"
      @click="onClose"/>
    <v-carousel
      class="user-popup-carousel"
      height="600">
      <v-carousel-item
        v-for="card in userObject"
        :key="card">
        <v-card>
          <v-row>
            <v-col
              cols="4"
              class="relative">
              <div class="avatar-popup-wrap">
                <v-window
                  light="true"
                  :v-model="window">
                  <v-window-item v-for="avatar in 2">
                    <v-img
                      v-if="card.photo"
                      :src="card.photo"
                      height="315"
                      max-width="315"
                      class="user-popup__avatar" />
                  </v-window-item>
                </v-window>
                <v-item-group
                  v-model="window"
                  class="shrink-avatar mr-6"
                  mandatory
                  tag="v-flex">
                  <v-item
                    v-for="n in 2"
                    :key="n"
                    v-slot:default="{ active, toggle }">
                    <div>
                      <v-btn
                        :input-value="active"
                        icon
                        @click="toggle">
                        <v-icon>mdi-record</v-icon>
                      </v-btn>
                    </div>
                  </v-item>
                </v-item-group>
              </div>
<!--
              <div class="coincidence">
                <h4 class="coincidence__title">
                  Совпадения
                </h4>
                <v-list
                  class="d-flex align-center coincidence__list"
                  light>
                  <v-list-item>
                    <img
                      v-if="true"
                      width="40"
                      src="@/assets/svg/category-1.svg"
                      alt="Handshake"/>
                    <img
                      v-else
                      width="40"
                      src="@/assets/svg/category-1-disabled.svg"
                      alt="Handshake"/>
                  </v-list-item>
                  <v-list-item>
                    <img
                      v-if="false"
                      width="40"
                      src="@/assets/svg/category-2.svg"
                      alt="Romantic"/>
                    <img
                      v-else
                      width="40"
                      src="@/assets/svg/category-2-disabled.svg"
                      alt="Romantic"/>
                  </v-list-item>
                  <v-list-item>
                    <img
                      v-if="false"
                      width="40"
                      src="@/assets/svg/category-3.svg"
                      alt="Nonsense"/>
                    <img
                      v-else
                      width="40"
                      src="@/assets/svg/category-3-disabled.svg"
                      alt="Nonsense"/>
                  </v-list-item>
                </v-list>
              </div>
-->
            </v-col>
            <v-col cols="8">
              <v-card-title class="user-popup__title">
                <span v-if="card.first_name || card.nickname ">{{card.first_name? card.first_name:card.nickname}}</span>
                <span v-if="card.last_name">{{card.last_name}}</span>
              </v-card-title>
<!--
              <v-card-subtitle class="user-popup__title-age d-flex align-center justify-start">
                <span>55 лет</span>
              </v-card-subtitle>
-->
              <perfect-scrollbar class="scrollbar scroll-profile-text">
                <v-card-text class="user-popup__text">
                  Тут могло бы быть о нём.
                </v-card-text>
              </perfect-scrollbar>
              <a
                href="#"
                class="add-friends d-flex align-center"
                @click="addToFavorites(card.user_token)">
                <v-img
                  height="30"
                  max-width="34"
                  src="/svg/favorite-icon.svg" />
                <span>Добавить в Избранные</span>
              </a>
<!--
              <a
                href="#"
                class="add-friends d-flex align-center">
                <v-img
                  height="27"
                  max-width="27"
                  src="/svg/add-friends.svg" />
                <span>
                  Отправить запрос в друзья
                </span>
              </a>
-->
            </v-col>
          </v-row>
        </v-card>
      </v-carousel-item>
    </v-carousel>
  </v-dialog>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";

  @Component
  export default class ProfileViewer extends Vue {
    @Prop({ default: true }) private value!: boolean;
    @Prop({ required: true }) private userObject!: any;
    @Prop() private active!: boolean;
    window = 0;

    get show() {
      if (this.value === true) {
        console.log("ProfileViewer show", this.userObject);
      }
      return this.value;
    }

    set show(value) {
      this.$emit("input", value);
    }

    onClose() {
      // console.log(JSON.stringify(this.userObject))
      this.show = false;
    }

    addToFavorites(user) {
      console.log(user);
    }
  }
</script>


<style
  lang="scss"
  scoped>

  .user-popup {
    border-radius: 15px;
  }

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
      content: '';
      display: block;
      width: 17px;
      height: 17px;
      border-radius: 50%;
      background: #fff;
      border: 1px solid #4690FF;
    }

    .v-item--active .v-btn:before {
      background: #4690FF;
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
    padding: 0 0 20px;

    span {
      display: block;
      font-size: 40px;
      color: #788EA8;
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
    color: #788EA8;
    display: block;
    padding: 0px 25px !important;
    border: 1px solid #788EA8;
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
      background: #79D800;
    }

    &.offline {
      background: #FF0000;

      &:before {
        content: '';
        width: 10px;
        height: 1px;
        background: #fff;
        position: absolute;
        right: 1px;
        top: 5px;
        transform: rotate(45deg);
      }

      &:after {
        content: '';
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
      background: #4690FF;
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
