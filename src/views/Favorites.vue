<template>
  <v-container
    class="dialog-cont pa-0"
    fluid>
    <v-row class="filters">
      <div class="filter-title-wrap d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <span class="filters-title">
            Фильтры:
          </span>
          <v-item-group class="radio-filter">
            <label
              class="radio-filter__label"
              @click="clearFilters">
              <input
                type="button"
                value="1"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">
                Все
              </span>
            </label>
            <label class="radio-filter__label">
              <input
                v-model="filter.h"
                type="checkbox"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">
                Handshake
              </span>
            </label>
            <label class="radio-filter__label">
              <input
                v-model="filter.r"
                type="checkbox"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">
                Romantic
              </span>
            </label>
            <label class="radio-filter__label">
              <input
                v-model="filter.n"
                type="checkbox"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">
                Nonsense
              </span>
            </label>
          </v-item-group>
        </div>
      </div>
    </v-row>
    <v-row
      no-gutters
      class="main-content">
      <v-col cols="8">
        <h4 class="view-title">
          Избранные
        </h4>
        <div class="users-list-container">
          <perfect-scrollbar class="scrollbar users-list">
            <v-list
              rounded
              nav>
              <v-list-item-group color="blue">
                <v-list-item
                  v-for="user in favorites"
                  :key="user"
                  @click="selectUser(user)">
                  <v-list-item-avatar @click.stop.prevent="openProfile(user)">
                    <v-img
                      v-if="user.photo != null"
                      :src="user.photo" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title class="item-title">
                      {{ user.first_name }} {{ user.last_name }}
                    </v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <div class="d-flex align-center mr-2">
                      <div
                        class="users-list__icon"
                        :class="{ active: user.status[0] }">
                        <img
                          src="@/assets/svg/category-1.svg"
                          alt=""
                          class="users-list__status users-list__status_active" />
                        <img
                          src="@/assets/svg/category-1-disabled.svg"
                          alt=""
                          class="users-list__status users-list__status_disabled" />
                      </div>
                      <div
                        class="users-list__icon"
                        :class="{ active: user.status[1] }">
                        <img
                          src="@/assets/svg/category-2.svg"
                          alt=""
                          class="users-list__status users-list__status_active" />
                        <img
                          src="@/assets/svg/category-2-disabled.svg"
                          alt=""
                          class="users-list__status users-list__status_disabled" />
                      </div>
                      <div
                        class="users-list__icon"
                        :class="{ active: user.status[2] }">
                        <img
                          src="@/assets/svg/category-3.svg"
                          alt=""
                          class="users-list__status users-list__status_active" />
                        <img
                          src="@/assets/svg/category-3-disabled.svg"
                          alt=""
                          class="users-list__status users-list__status_disabled" />
                      </div>
                      <v-btn icon="mdi-account-minus" @click.prevent="deleteFav(user)">
                        <v-icon>mdi-account-minus</v-icon>
                      </v-btn>
                    </div>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </perfect-scrollbar>
        </div>
      </v-col>
      <v-col
        cols="4"
        class="pl-2"
        style="min-height: 500px;">
        <TextChat
          :thread-token="threadToken"
          :users="users">
          <v-col
            v-if="currentUser"
            class="chat-name">
            {{ currentUser.name }}
          </v-col>
          <v-col v-if="currentUser">
            <v-icon
              color="white"
              class="float-right px-2"
              @click="openVideoChat(currentUser)">
              mdi-video
            </v-icon>
          </v-col>
        </TextChat>
      </v-col>
    </v-row>
    <ProfileViewer
      v-model="showProfileViewer"
      :user-object="userObject"
      :active="active"
      style="z-index: 1000;" />
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue, Model, Watch } from "vue-property-decorator";
  import { FavoritesModule } from "@/store/modules/favorites";
  import ProfileViewer from "@/components/ProfileViewer.vue";
  import TextChat from "@/views/chat/TextChat.vue";
  import { ChatModule } from "@/store/modules/chat";
  import { UserModule } from "@/store/modules/user";
  import { getPrintableNameFull } from "@/lib/utils";
  import { AlertsModule, IInvite } from "@/store/modules/alerts";
  import Header from "@/components/Header.vue";
  import { SetsModule } from "@/store/modules/sets";

  @Component({
    components: { Header, TextChat, ProfileViewer }
  })
  export default class Favorites extends Vue {
    @Model("change")
    currentUser: {
      name: "";
      photo: "";
      user_token: "";
    };

    window = 0;
    dialog = false;
    active = false;
    userObject: any = {};
    showProfileViewer = false;

    users = [];
    threadToken = null;
    vRoomId = null;

    ignoreWatchersFilters = false;

    filter = {
      h: false,
      r: false,
      n: false
    };

    favoritesUpdater = 0;

    get favorites() {
      const { n, h, r } = this.filter;
      if (n || h || r) {
        return FavoritesModule.favorites.filter((user) => {
          const { status } = user;
          return (status[0] && h) || (status[1] && r) || (status[2] && n);
        });
      } else {
        return FavoritesModule.favorites;
      }
    }

    async addToFavorites(user_token) {
      const section = SetsModule.currentSection;
      const { error, data } = await FavoritesModule.addCandidate({ user_token, section });
      error ? console.error("addToFavorites", error) : console.log("addToFavorites", data);
    }

    async deleteFav(user) {
      console.log(user);
      const { error, data } = await FavoritesModule.chosenDeleteUser(user.user_token);
      error ? console.error("deleteFromFavorites", error) : console.log("deleteFromFavorites", data);
    }

    created() {
      FavoritesModule.getConfirmed().catch(e => console.error(e));
    }

    @Watch("filter.h")
    changeH() {
      this.applyFilter();
    }

    @Watch("filter.r")
    changeR() {
      this.applyFilter();
    }

    @Watch("filter.n")
    changeN() {
      this.applyFilter();
    }

    openVideoChat(user) {
      const { photo, name } = user;
      const threadToken = this.threadToken;
      const invite: IInvite = {
        who: name,
        photo: photo,
        status: 1,
        callback1: this.goToVideoChat,
        threadToken: threadToken
      };
      AlertsModule.INSERT_INVITE_FIRST(invite);
    }

    goToVideoChat() {
      this.$router.push({
        name: "friends-chat",
        params: {
          thread: this.threadToken,
          vRoomId: this.vRoomId
        }
      });
    }

    async selectUser(user) {
      const name = getPrintableNameFull(user);
      const { photo, user_token } = user;
      if (name && user_token) {
        this.currentUser = { name, photo, user_token };
      }

      this.threadToken = null;
      this.users = [];
      const me = await UserModule.getProfile();
      this.users.push(me.data);
      this.users.push({
        profile: user,
        user_token: user.user_token
      });
      const userToken = user.user_token;
      const result = await this.getThreadToken(userToken);
      if (result) {
        this.threadToken = result.thread_token;
        this.vRoomId = result.vroom_id;
      }
    }

    openProfile(user) {
      const { first_name, last_name, nickname, photo, user_token } = user;
      this.userObject = [{ first_name, last_name, nickname, photo, user_token }];
      console.log(this.userObject.length);
      this.active = this.userObject.length <= 1;
      this.showProfileViewer = true;
    }

    async getThreadToken(userToken) {
      const { error, data } = await ChatModule.getThreadToken({ userToken });
      if (!error) {
        console.log(data);
        return data;
      } else {
        console.log(error);
      }
    }

    clearFilters() {
      this.ignoreWatchersFilters = true;
      this.filter = {
        h: false,
        r: false,
        n: false
      };
      setTimeout(() => {
        this.applyFilter();
        this.ignoreWatchersFilters = false;
      }, 1);
    }

    applyFilter() {
      if (!this.ignoreWatchersFilters) this.favoritesUpdater++;
    }
  }
</script>

<style lang="scss">
  .v-list--rounded .v-list-item > .v-ripple__container {
    border-radius: 15px !important;
  }

  .v-toolbar__content {
    padding: 0 !important;
  }
</style>

<style
  lang="scss"
  scoped>
  .view-title {
    font-size: 20pt;
    font-weight: 400;
    color: #788ea8;
    margin-left: 0;
    padding-bottom: 0;
  }

  .v-list--rounded .v-list-item,
  .v-list--rounded .v-list-item:before {
    border-radius: 15px !important;
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.15);
  }

  .users-list__status_disabled {
    display: block;
  }

  .users-list__status_active {
    display: none;
  }

  .users-list__status {
    display: block;
    width: 100%;
    height: auto;

    &.users-list__status_active {
      display: none;
    }
  }

  .active {
    .users-list__status_disabled {
      display: none;
    }

    .users-list__status_active {
      display: block;
    }
  }

  .radio-filter {
    display: flex;
    align-items: center;

    &__input {
      display: none;

      &:checked + .radio-filter__label-text {
        color: #fff;
        background: linear-gradient(161.69deg, #4690ff 20.7%, #16c1f8 96.61%);
      }
    }

    &__label {
      display: block;
      cursor: pointer;
    }

    &__label-text {
      background: #ffffff;
      border-radius: 73px;
      padding: 2px 10px;
      color: #b8b8b8;
      font-size: 16px;
      font-weight: 400;
      margin-right: 10px;
    }
  }

  .reset-filter {
    background: transparent;
    outline: none;
    padding: 0 15px;
    font-weight: 500;
    font-size: 25px;
    background: #ffffff;
    border-radius: 20px;
    color: #000000;
  }

  .last-online {
    font-size: 16px;
    font-weight: 700;
    color: #949494;
  }

  .item-title {
    font-size: 15px;
    line-height: 28px;
    color: #2a5885 !important;
    font-weight: 600;
  }

  .users-list-container {
    background: #f1f1f1;
    padding: 10px;
    border-radius: 15px;

    .users-list {
      max-height: 500px;

      .v-list {
        background: transparent !important;

        .v-list-item {
          background: white;
          margin-right: 15px;
        }
      }
    }
  }

  .users-list__icon {
    display: block;
    margin-right: 10px;
    width: 30px;
    height: 30px;
  }

  .chat-name {
    padding: 4px 10px;
    font-weight: 500;
  }
</style>
