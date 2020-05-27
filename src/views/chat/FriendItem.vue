<template>
  <div
    class="user-card"
    :class="{exists: exists}">
    <div
      v-if="!self && !user.is_banned"
      class="user-card-nav d-flex flex-column align-center">
      <v-btn
        fab
        small
        color="primary"
        class="user-nav-btn"
        @click="viewProfile">
        <v-icon>
          fas fa-info
        </v-icon>
      </v-btn>
      <v-btn
        v-if="!user.is_chosen"
        fab
        small
        color="primary"
        class="user-nav-btn"
        @click="addToFavorite">
        <v-icon>
          far fa-star
        </v-icon>
      </v-btn>
      <v-btn
        fab
        small
        color="red"
        class="user-nav-btn"
        @click="ban">
        <v-icon>
          fas fa-times
        </v-icon>
      </v-btn>
    </div>
    <div class="user-card__main">
      <div
        v-if="!user.is_banned"
        class="user-card-wrap">
        <div
          v-if="isVideoChat"
          class="status">
          <v-icon
            v-if="isVideoMuted"
            color="red">
            mdi-video-off
          </v-icon>
          <v-icon
            v-if="isAudioMuted"
            color="red">
            mdi-microphone-off
          </v-icon>
        </div>
        <div
          ref="video"
          class="video" />
        <progressive-background
          v-if="profile && profile.photo_1"
          :src="profile.photo_1" />
      </div>
      <div
        v-else
        class="user-card-wrap"
        @click="unban">
        <v-img
          height="100%"
          width="100%"
          :src="require('@/assets/img/banned.svg')" />
      </div>
      <h4 class="user-card__name">
        {{ nickname }}
      </h4>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import "@mdi/font/css/materialdesignicons.css";
  import { getPrintableName } from "@/lib/utils";
  import JanusRoom from "@/lib/janusRoom";
  import { Stream } from "@/models/Stream";
  import { FavoritesModule } from "@/store/modules/favorites";
  import { UserModule } from "@/store/modules/user";
  import { AlertsModule } from "@/store/modules/alerts";

  @Component
  export default class FriendItem extends Vue {
    @Prop({ default: false, type: Boolean }) readonly self;
    @Prop({ default: false, type: Boolean }) isBottom;
    @Prop({ default: false, type: Boolean }) isRight;
    @Prop({ default: false, type: Boolean }) isVideoChat;
    @Prop({ type: JanusRoom }) janusRoom;
    @Prop({ type: Object }) user;
    @Prop({ type: Number }) section;

    exists = true;

    //TODO for future

    get nickname() {
      return getPrintableName(this.user.profile);
    }

    get profile() {
      return this.user.profile;
    }

    //TODO add deep option
    @Watch("user.stream")
    changeStream(stream: Stream) {
      if (stream) {
        this.mountVideo(stream);
      } else {
        this.removeVideo();
      }
    }

    @Watch("user.stream.hasVideo")
    changeVideo(hasVideo: boolean) {
      if (this.user.is_banned) {
        return;
      }
      const videoElement = this.$refs.video as Element;
      const video = videoElement.getElementsByTagName("video").item(0);
      if (video) {
        if (hasVideo) {
          video.style.display = null;
        } else {
          video.style.display = "none";
        }
      }
    }

    @Watch("isVideoChat") //TODO remove it???
    controlVideo(isVideoChat) {
      if (this.user.stream) {
        if (isVideoChat) {
          this.mountVideo(this.user.stream);
        } else {
          this.removeVideo();
        }
      }
    }

    mountVideo(stream) {
      if (this.user.is_banned) {
        return;
      }
      const videoElement = this.$refs.video as Element;
      let video = videoElement.getElementsByTagName("video").item(0);
      if (video == null) {
        video = document.createElement("video");
        video.setAttribute("playsinline", "");
        video.autoplay = true;
        if (this.self) {
          video.muted = true;
        }
        video.controls = false;
        videoElement.appendChild(video);
      }
      this.janusRoom.attachStream(video, stream.id)
          .then(() => {
            console.log("stream attached", stream);
          })
          .catch(function(err) {
            console.error(err);
          });
    }

    removeVideo() {
      const videoElement = this.$refs.video as Element;
      const video = videoElement.getElementsByTagName("video").item(0);
      if (video) {
        video.remove();
      }
    }

    get isVideoMuted() {
      return this.user.stream ? !this.user.stream.hasVideo : false;
    }

    get isAudioMuted() {
      return this.user.stream ? !this.user.stream.hasAudio : false;
    }

    viewProfile() {
      this.$emit("view-profile", this.user.user_token);
    }

    async addToFavorite() {
      const { error, data } = await FavoritesModule.addCandidate({
        user_token: this.user.user_token,
        section: this.section,
      });
      if (!error) {
        console.log("addToFavorites", data);
        AlertsModule.SET_MESSAGE("Запрос на добавление в избранное отправлен");
      } else {
        console.error("addToFavorites", error);
      }
    }

    ban() {
      this.$confirm("Забанить?").then(() => {
        UserModule.setBan({ userToken: this.user.user_token }).then(data => {
          if (data) {

            this.user.is_banned = true;
          } else {
            console.log("ban result", data);
          }
        }).catch(e => {
          console.error(e);
        });
      }).catch(() => {
        //ok
      });
    }

    unban() {
      this.$confirm("Разбанить?").then(() => {
        UserModule.setBan({ userToken: this.user.user_token, clearBan: true }).then(data => {
          if (data) {
            this.user.is_banned = false;
          } else {
            console.log("ban result", data);
          }
        }).catch(e => {
          console.error(e);
        });
      }).catch(() => {
        //ok
      });
    }
  }
</script>

<style lang="scss">

  .user-card-nav {
    display: none !important;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .user-nav-btn {
    background: #C0C0C0 !important;
    margin-bottom: 5px;

    &.v-size--small {
      width: 25px;
      height: 25px;
    }

    .v-icon.v-icon {
      font-size: 14px;
      color: #fff;
    }
  }

  .user-card {
    position: relative;

    &.exists {
      .user-card-wrap {
        cursor: pointer;
      }
    }

    &__name {
      font-weight: 400;
      font-size: 11pt;
      text-align: center;
      color: #000000;
      padding: 0 0 10px;
      width: 100%;
    }

    &__main {
      display: block;
      position: relative;
      overflow: hidden;
    }

    &:hover .user-card-nav {
      display: block;
      z-index: 3;
    }
  }

  .user-card-wrap {
    border-radius: 12px;
    overflow: hidden;
    width: 100%;
    padding-top: 100%;
    position: relative;
    background-color: lightgray;
    box-shadow: 0 3px 3px -2px rgba(0, 0, 0, .2), 0 3px 4px 0 rgba(0, 0, 0, .14);

    .progressive-background {
      position: initial;

      * div {
        padding-bottom: 0 !important;
      }
    }

    .video {
      object-fit: cover;
      position: absolute;
      z-index: 2;
      width: 100%;
      height: 100%;

      video {
        display: flex;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .status {
      z-index: 10;
      position: absolute;
      bottom: 0;
      margin: 0 5px;
    }
  }

  .user-card-wrap > * {
    margin-top: -100%;
  }
</style>
