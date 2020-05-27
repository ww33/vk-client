<template>
  <div>
    <v-container class="header-container">
      <template v-if="message">
        <v-snackbar
          top
          :value="true"
          :timeout="5000"
          color="primary"
          @input="closeMessage">
          {{ message }}
          <v-btn
            icon
            dark
            class="mr-0"
            @click.native="closeMessage">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
      </template>

      <template v-else-if="error">
        <v-snackbar
          top
          :value="true"
          :timeout="5000"
          color="red"
          @input="closeError">
          {{ error }}
          <v-btn
            icon
            dark
            class="mr-0"
            @click.native="closeError">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
      </template>

      <template v-else-if="invite">
        <v-snackbar
          class="snackbar-invite"
          :value="true"
          bottom
          left
          :timeout="20000000"
          :multi-line="true"
          color="white"
          @input="closeError">
          <div class="popup-avatar-wrap">
            <v-avatar size="55">
              <img
                :src="invite.photo"
                class="popup-avatar"
                alt="Photo" />
            </v-avatar>
            <h4 class="name-title">
              {{ invite.who }}
            </h4>
          </div>
          <div class="content-wrap">
            <div>
              <p
                v-if="inviteStatus === 1"
                class="message-text">
                Пригласить в видеочат
              </p>
              <p
                v-if="inviteStatus === 2"
                class="message-text">
                Приглашает в видеочат
              </p>
              <p
                v-if="inviteStatus === 3"
                class="message-text">
                Не может сейчас перейти в видеочат
              </p>
            </div>
            <div class="btn-action d-flex justify-space-between align-center">
              <v-btn
                v-if="inviteStatus === 1"
                class="custom-btn"
                @click="inviteClickHandler(1)">
                Открыть чат
              </v-btn>
              <v-btn
                v-if="inviteStatus === 2"
                class="custom-btn"
                @click="inviteClickHandler(2)">
                Принять
              </v-btn>
              <v-btn
                v-if="inviteStatus === 2"
                class="custom-btn"
                @click="inviteClickHandler(3)">
                Отклонить
              </v-btn>
              <v-btn
                v-if="inviteStatus === 3"
                class="custom-btn"
                @click="inviteClickHandler(4)">
                Закрыть чат
              </v-btn>
            </div>
          </div>
          <v-btn
            icon
            dark
            class="popup-close-btn"
            @click.native="clearInvites">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-snackbar>
      </template>
    </v-container>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Watch } from "vue-property-decorator";
  import { AlertsModule } from "@/store/modules/alerts";
  import { ChatModule } from "@/store/modules/chat";

  @Component
  export default class Alerts extends Vue {

    get error() {
      return AlertsModule.error;
    }

    get message() {
      return AlertsModule.message;
    }

    get invite() {
      return AlertsModule.invite;
      // if(AlertsModule.invites.length > 0) return AlertsModule.invites[0]
    }

    get inviteStatus() {
      if (AlertsModule.invite && AlertsModule.invite.status) {
        return AlertsModule.invite.status;
      } else {
        return 0;
      }
    }

    closeError() {
      AlertsModule.CLEAR_ERROR();
    }

    closeMessage() {
      AlertsModule.CLEAR_MESSAGE();
    }

    clearInvites() {
      AlertsModule.DELETE_CURRENT_INVITE();
      // AlertsModule.clearInvites();
    }

    inviteClickHandler(variant: number) {
      if (variant == 1) {
        if (this.invite) {
          ChatModule.invite(this.invite.threadToken);
          if (typeof this.invite.callback1 == "function") {
            this.invite.callback1();
          }
        }
      } else if (variant == 2) {
        if (this.invite) {
          if (typeof this.invite.callback1 == "function") {
            this.invite.callback1();
          }
          this.$router.push({
            name: "friends-chat",
            params: {
              thread: this.invite.threadToken,
              vRoomId: this.invite.vRoomId
            }
          });
        }
      } else if (variant == 3) {
        if (this.invite) {
          ChatModule.invite(this.invite.threadToken);
          if (typeof this.invite.callback2 == "function") {
            this.invite.callback2();
          }
        }
      }
      AlertsModule.DELETE_CURRENT_INVITE();
    }
  }
</script>

<style
  lang="scss"
  scoped>
  .content-wrap {
    width: 100%;
    height: 115px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .custom-btn {
    max-width: 140px;
    width: 100%;
    font-size: 13px;
  }

  .popup-close-btn {
    top: 14px;
    right: 20px;

    .v-btn__content {
      .v-icon {
        width: 25px;
        height: 25px;
        //noinspection CssUnknownTarget
        background: url("/svg/close-gray.svg") no-repeat center center;
        background-size: cover;

        &:before {
          display: none;
        }

        &:after {
          display: none;
        }
      }
    }
  }

  .custom-btn {
    margin: 0 !important;
  }

  .name-title {
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: #2a5885;
  }

  .header-container {
    padding: 0;
    position: relative;
    z-index: 10;

    .v-toolbar {
      box-shadow: 0 2px 2px rgba(0, 0, 0, 0.1);
    }
  }

  .version-text {
    margin-left: 15px;
    color: rgba(93, 96, 98, 0.24);
    font-size: 75%;
  }

  .link-events {
    margin-left: 5px;
    font-size: 90%;
    text-decoration: none;
    color: black;
  }
</style>
