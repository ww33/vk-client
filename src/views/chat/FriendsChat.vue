<template>
  <v-container
    fluid
    class="dialog-cont main-content">
    <v-row
      no-gutters>
      <v-col cols="8">
        <v-row no-gutters>
          <template v-for="(item, index) in users">
            <v-col
              v-if="index<3"
              :key="index"
              :cols="thread ? 6 : 4"
              class="pr-2">
              <FriendItem
                :section="sectionId"
                :self="index === 0"
                :janus-room="janusRoom"
                :user="item"
                :is-video-chat="isVideoChatEnabled"
                @view-profile="viewProfile(item)" />
            </v-col>
          </template>
        </v-row>
        <v-row no-gutters>
          <template v-for="(item, index) in users">
            <v-col
              v-if="index>=3"
              :key="index"
              :cols="thread ? 6 : 4"
              class="pr-2">
              <FriendItem
                :section="sectionId"
                :janus-room="janusRoom"
                :user="item"
                :is-video-chat="isVideoChatEnabled"
                @view-profile="viewProfile(item)" />
            </v-col>
          </template>
        </v-row>
        <v-row
          no-gutters>
          <v-container fluid>
            <v-row
              no-gutters
              justify="space-between"
              align="center">
              <div>
                <template v-if="isVideoChatEnabled">
                  <v-row
                    no-gutters
                    class="mr-2"
                    align="center">
                    <v-btn
                      ref="disableButton"
                      rounded
                      small
                      class="gradient-button"
                      @click="disableVideoChat">
                      Выйти
                    </v-btn>
                    <div class="chat-control d-flex">
                      <v-btn
                        rounded
                        small
                        class="control-btn mx-1"
                        @click="muteAudio">
                        <v-icon v-if="sendAudio">
                          mdi-microphone
                        </v-icon>
                        <v-icon v-else>
                          mdi-microphone-off
                        </v-icon>
                      </v-btn>
                      <v-btn
                        rounded
                        small
                        class="control-btn mx-1"
                        @click="muteVideo">
                        <v-icon v-if="sendVideo">
                          mdi-video
                        </v-icon>
                        <v-icon v-else>
                          mdi-video-off
                        </v-icon>
                      </v-btn>
                    </div>
                  </v-row>
                </template>
                <template v-else>
                  <v-btn
                    v-if="videoRoomId > 0"
                    ref="enableButton"
                    rounded
                    small
                    class="gradient-button"
                    @click="enableVideoChat">
                    Включить видео
                  </v-btn>
                </template>
              </div>
              <div>
                <v-tooltip
                  v-model="showTooltip"
                  bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      :disabled="true"
                      class="gradient-button"
                      rounded
                      small
                      v-on="on">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 30 32"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M2.37544 7.14144C2.37544 7.14144 1.69075 11.8098 4.08719 14.5798C6.49141 17.3497 8.40546 16.486 9.05903 16.027C9.71261 15.5601 15.4236 9.66238 15.4236 9.66238C15.4236 9.66238 14.9723 3.29001 14.9957 2.38746C15.019 1.4849 15.447 0.807984 17.2443 0.730177C19.0416 0.64459 26.4488 0.730177 26.4488 0.730177C26.4488 0.730177 29.3977 0.473416 29.281 5.43748C29.1409 8.4875 28.9075 8.0051 28.9075 8.0051C28.9075 8.0051 26.3554 8.81428 23.9357 8.16849C21.5159 7.52269 21.1035 6.40228 21.1035 6.40228C21.1035 6.40228 21.8038 8.65867 23.5077 9.34337C25.2117 10.0281 27.5225 9.66238 27.5225 9.66238V10.1992C27.5225 10.1992 25.7719 11.732 23.6711 11.5375C21.5703 11.343 20.7845 11.273 20.7845 11.273L20.5199 14.8599L21.0023 15.0777C21.0023 15.0777 21.7182 14.2141 22.1772 14.2763C22.6363 14.3308 23.7256 15.8247 23.7256 15.8247L23.8345 17.8009L22.2862 16.5171C22.2862 16.5171 20.5511 18.4545 20.0375 18.4934C19.2206 17.9488 19.2361 17.7465 19.2361 17.7465L18.3803 19.6216C18.3803 19.6216 21.228 22.1426 20.5199 23.7376C19.8119 25.3326 17.2754 27.5735 17.5789 28.5538C17.8823 29.5342 18.4892 29.1996 18.4892 29.1996C18.4892 29.1996 20.7689 28.795 21.1113 31.1292C15.8282 31.1992 15.1746 30.9658 15.1746 30.9658C15.1746 30.9658 14.3343 30.1566 14.4277 28.4527C14.5211 26.7487 15.9294 25.6205 15.9294 25.6205L13.5718 23.2163C13.5718 23.2163 14.2721 24.4845 13.9998 25.1459C13.7274 25.7995 9.82932 27.8769 9.82932 27.8769L9.99271 28.9506C9.99271 28.9506 13.1205 28.7017 13.4162 31.2537C7.93862 31.1214 7.68963 31.1448 7.68963 31.1448L6.72483 26.3285L8.49104 23.8699C8.49104 23.8699 1.47289 21.3178 0.842655 16.2215C0.18908 11.0862 2.37544 7.14144 2.37544 7.14144Z"
                          fill="white" />
                        <path
                          d="M19.7964 4.7605C20.3894 4.7605 20.8701 4.27977 20.8701 3.68677C20.8701 3.09376 20.3894 2.61304 19.7964 2.61304C19.2034 2.61304 18.7227 3.09376 18.7227 3.68677C18.7227 4.27977 19.2034 4.7605 19.7964 4.7605Z"
                          fill="#e0e0e0 " />
                      </svg>
                    </v-btn>
                  </template>
                  <span>Оживи беседу</span>
                </v-tooltip>
              </div>
              <div v-if="showSelector">
                <v-row
                  class="mr-2"
                  align="center">
                  <v-icon
                    :disabled="matchIndex === 0"
                    color="primary"
                    @click="prev">
                    mdi-chevron-double-left
                  </v-icon>
                  <div class="other-match px-2">
                    Другие мэтчи
                  </div>
                  <v-icon
                    :disabled="(matchIndex + 1) >= availableMatches.length"
                    color="primary"
                    @click="next">
                    mdi-chevron-double-right
                  </v-icon>
                </v-row>
              </div>
            </v-row>
          </v-container>
        </v-row>
      </v-col>
      <v-col
        cols="4"
        class="pl-2"
        style="min-height: 500px">
        <TextChat
          :thread-token="threadToken"
          :users="users">
          <template v-if="thread">
            <span class="user-chat-name">
              {{ setNum }}
            </span>
          </template>
          <template v-else>
            <v-avatar size="28">
              <img
                v-if="sectionImg"
                :src="sectionImg"
                class="match-type" />
            </v-avatar>
            <span class="chat-name">
              День: {{ day }}, Сет: {{ setNum }}
            </span>
          </template>
        </TextChat>
      </v-col>
    </v-row>
    <ProfileViewer
      v-model="showProfileViewer"
      :user-object="userObject"
      :active="active"
      style="z-index: 1000" />
  </v-container>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import FriendItem from "@/views/chat/FriendItem.vue";
  import { MatchModule } from "@/store/modules/match";
  import { UserModule } from "@/store/modules/user";
  import TextChat from "@/views/chat/TextChat.vue";
  import { ChatModule } from "@/store/modules/chat";
  import { getDayAsString, getPrintableName } from "@/lib/utils";
  import JanusRoom from "@/lib/janusRoom";
  import { Stream } from "@/models/Stream";
  import ProfileViewer from "@/components/ProfileViewer.vue";
  import vkService from "@/services/vkService";

  @Component({
    components: {
      ProfileViewer,
      TextChat,
      FriendItem
    }
  })
  export default class FriendsChat extends Vue {
    icons: {
      iconfont: "mdiSvg";
    };

    @Prop()
    section; //for section filtering
    @Prop()
    thread; //for favorites only
    @Prop()
    vRoomId; //for favorites only

    showProfileViewer = false;
    userObject: any = {};
    active = false;

    showTooltip = false;

    myToken = null;
    janusRoom: JanusRoom = null;
    janusConnected = false;
    isVideoChatEnabled = false;

    sendVideo = true;
    sendAudio = true;

    videoRoomId = -1;

    showSelector = true;
    sectionId = null;
    sectionImg = null;
    setNum = null;
    day = null;

    users = [];

    availableMatches = [];
    matchIndex = 0;

    matchToken = null;
    threadToken = null;

    janusServer = null;

    created() {
      console.log("section", this.section);
      console.log("thread", this.thread);
      console.log("vRoomId", this.vRoomId);

      this.loadMyProfile().then((myProfile) => { //TODO: loaded
        this.myToken = myProfile.user_token;
        this.janusRoom = new JanusRoom(this.options);
      });
    }

    mounted() {
      if (this.thread) {
        console.log("load favorite thread", this.thread);
        this.showSelector = false;
        ChatModule.getThreadUsers(this.thread).then(result => {
          for (const user of result.data.users) {
            user.stream = null;
            this.users.push(user);
          }
          this.setNum = getPrintableName(this.users[1].profile);
          this.threadToken = this.thread;
          this.videoRoomId = this.vRoomId;
        });
      } else {
        if (this.section) {
          this.sectionId = Number.parseInt(this.section);
          console.log("load matches for section", this.sectionId);
          this.loadMatches(getDayAsString(0), this.sectionId);
          this.loadMatches(getDayAsString(-1), this.sectionId);
        } else {
          console.log("load matches for all sections");
          this.loadMatches(getDayAsString(0), 1);
          this.loadMatches(getDayAsString(-1), 1);
          this.loadMatches(getDayAsString(0), 3);
          this.loadMatches(getDayAsString(-1), 3);
        }
        this.showSelector = this.availableMatches.length > 1;
      }
    }

    @Watch("sectionId")
    initSection() {
      this.sectionImg = require("@/assets/svg/category-" + this.sectionId + ".svg");
    }

    @Watch("videoRoomId")
    changeVideoRoom() {
      if (this.isVideoChatEnabled) {
        console.log("Connect to room", this.videoRoomId);
        //TODO check if server was changed
        this.janusRoom.createRoomHandler({
          resolve: () => {
            this.joinToRoom();
          }
        });
      }
    }

    @Watch("sendVideo")
    controlVideo(sendVideo) {
      this.janusRoom.configure({
        sendVideo: sendVideo,
        sendAudio: this.sendAudio
      }).then(() => {
        this.setState();
      });
    }

    beforeDestroy() {
      if (this.joined) {
        this.leave().then(() => {
          this.janusRoom.stop();
        });
      }
    }

    @Watch("sendAudio")
    controlAudio(sendAudio) {
      this.janusRoom.configure({
        sendVideo: this.sendVideo,
        sendAudio: sendAudio
      }).then(() => {
        this.setState();
      });
      //TODO fix audio track muted
      /*
      console.log(this.janusRoom.getConfig().videoRoomHandler);
      if (sendAudio) {
        this.janusRoom.getConfig().videoRoomHandler.unmuteAudio();
      } else {
        this.janusRoom.getConfig().videoRoomHandler.muteAudio();
      }
      */
    }

    setState() {
      const user = this.users.find((it) => it.user_token === this.myToken);
      if (user && user.stream) {
        user.stream.hasVideo = this.sendVideo;
        user.stream.hasAudio = this.sendAudio;
      }
    }

    @Watch("matchToken")
    async selectMatchToken(matchToken) {
      if (!matchToken) {
        return;
      }
      const { error, data } = await MatchModule.getMatchMembers({ match_token: matchToken });
      if (error) {
        console.error(error);
      } else {
        this.users = [];
        data.users.forEach(user => {
          user.stream = null;
          this.users.push(user);
        });
        this.sectionId = data.section;
        this.setNum = data.set_num;
        this.day = data.day;
      }

      this.getThreadToken(matchToken).then(async (result) => {
        if (result) {
          this.threadToken = result.thread_token;
          if (result.vroom_id) {
            const server = await this.getServer(result.vroom_id);
            console.log("   ***   ", this.janusConnected);
            if (server !== this.janusServer && this.janusConnected === true) {
              console.log("  ----   load server for room", result.vroom_id, server);
              this.janusRoom.stop();
              this.janusRoom = new JanusRoom(this.options);
            }
            this.videoRoomId = result.vroom_id;
          }
        }
      });
    }

    localJoined() {
      const user = this.users.find((it) => it.user_token === this.myToken);
      if (user) {
        user.stream = new Stream(0, this.myToken);
      }
    }

    addStream(stream: Stream) {
      if (!this.isVideoChatEnabled) {
        return;
      }
      const user = this.users.find((user) => {
        return user.user_token === stream.name;
        //return user.user_token === "?>`$8JR3<rg?Qp-^#eC0";
      });
      if (user && user.stream == null) {
        const config = this.janusRoom.getConfig();
        stream.feed = config.feeds[stream.id];
        user.stream = stream;
      }
    }

    removeStream(streamId) {
      const user = this.users.find((user) => {
        return user.stream && user.stream.id === streamId;
      });
      if (user) {
        user.stream = null;
      }
    }

    exists = function() {
      const roomInfo = {
        room: this.videoRoomId
      };
      return this.janusRoom.exists(roomInfo);
    };

    create = function() {
      const roomInfo = {
        room: this.videoRoomId,
        //description: "{\"test\":\"passed\"}",
        secret: "secret"
      };
      return this.janusRoom.createRoom(roomInfo);
    };

    join = function() {
      const roomInfo = {
        room: this.videoRoomId,
        profile: this.profile = {
          name: this.myToken,
          id: this.myToken
        }
      };
      return this.janusRoom.joinRoom(roomInfo);
    };

    connected() {
      this.janusConnected = true;
    }

    disconnected() {
      this.janusConnected = false;
    }

    checkState(streamId) {
      const feed = this.janusRoom.getConfig().feeds[streamId];
      const remoteStream = feed.webrtcStuff.remoteStream as MediaStream;
      if (remoteStream) {
        this.setTrackState(streamId,
          remoteStream.getVideoTracks().length > 0,
          remoteStream.getAudioTracks().length > 0);
      }
    }

    setTrackState(streamId, hasVideo, hasAudio) {
      const user = this.users.find(user => {
        return user.stream && user.stream.id == streamId;
      });
      if (user) {
        const stream = user.stream as Stream;
        stream.hasVideo = hasVideo;
        stream.hasAudio = hasAudio;
      }
    }

    options = {
      getJanusServer: async () => {
        const server = await this.getServer(this.videoRoomId);
        this.setJanusServer(server);
        console.log("CALLBACK SERVER", server);
        return server;
      },
      onLocalJoin: () => this.localJoined(),
      onRemoteJoin: (streamIndex, username, feedId) => {
        this.addStream(new Stream(streamIndex, username, null));
        this.checkState(streamIndex);
      },
      onRemoteUnjoin: (streamId) => this.removeStream(streamId),
/*
      onMessage: function(data) {
        //
      },
*/
      onError: (message, error) => {
        if (error.includes("No capture device found")) {
          alert("Камера не найдена.");
          const button = this.$refs.enableButton as any;
          button.loading = false;
        }
        console.error(message, error);
        if (error) {
          switch (error.code) {
            case 0:
              //TODO dialog
              break;
          }
        }
      },
      connectionInit: () => this.connected(),
      connectionLost: () => this.disconnected(),
      connectionRestored: () => this.disconnected(),
/*
      reinitHandler: () => {
      },
      onVolumeMeterUpdate: (streamIndex, volume) => {
      }
*/
    };

    async enableVideoChat() {
      const button = this.$refs.enableButton as any;
      button.loading = true;
      if (this.janusConnected) {
        if (this.joined) {
          await this.joinToRoom();
        } else {
          this.janusRoom.createRoomHandler({
            resolve: () => {
              this.joinToRoom();
            }
          });
        }
      } else {
        await this.janusRoom.init({
          success: () => this.joinToRoom()
        });
      }
    }

    async getServer(spaceId) {
      const result = await vkService.getVideoServer(spaceId.toString());
      if (result.server_socket) {
        return result.server_socket;
      } else {
        throw result;
      }
    }

    disableVideoChat() {
      const button = this.$refs.disableButton as any;
      button.loading = true;
      //TODO fix audio context;
      if (!this.sendAudio) {
        this.sendAudio = true;
      }
      if (!this.sendVideo) {
        this.sendVideo = true;
      }
      //TODO fix audio context;
      this.stopOwnFeed().then(() => {
        button.loading = false;
        this.isVideoChatEnabled = false;
      });
    }

    async joinToRoom() {
      const result = await this.exists();
      if (result.exists) {
        this.startOwnFeed();
      } else {
        this.create().then(() => this.startOwnFeed());
      }
    }

    joined = false;

    startOwnFeed() {
      if (this.joined) {
        this._startOwnFeed();
      } else {
        this.join().then(() => {
          this.joined = true;
          this._startOwnFeed();
        }).catch(() => {
          //ok
        });
      }
    }

    _startOwnFeed() {
      this.janusRoom.startOwnFeed({
        audioSend: this.sendAudio,
        videoSend: this.sendVideo
      }, () => {
        this.isVideoChatEnabled = true;
      });
    }

    async stopOwnFeed() {
      return new Promise(async (resolve, reject) => {
        try {
          /*
          this.users.forEach(user => {
            if (user.stream && user.stream.feed) {
              user.stream.feed.detach();
            }
          });
          */
          this.janusRoom.stopOwnFeed().then(() => {
            const user = this.users.find((it) => it.user_token === this.myToken);
            if (user) {
              user.stream = null;
            }
            resolve();
          });
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    }

    async leave() {
      return new Promise(async (resolve, reject) => {
        try {
          this.users.forEach(user => {
            if (user.stream && user.stream.feed) {
              user.stream.feed.detach();
            }
          });
          this.janusRoom.leaveRoom({
            leaving: () => {
              const user = this.users.find((it) => it.user_token === this.myToken);
              if (user) {
                user.stream = null;
                this.joined = false;
                this.janusRoom.getConfig().videoRoomHandler.detach({
                  //noRequest: true,
                  success: () => {
                    console.log(this.janusRoom.getConfig().videoRoomHandler);
                  }
                });
              }
              resolve();
            }
          }).catch(() => {
            //ok
          });
        } catch (e) {
          console.error(e);
          reject(e);
        }
      });
    }

    muteAudio() {
      this.sendAudio = !this.sendAudio;
    }

    muteVideo() {
      this.sendVideo = !this.sendVideo;
    }

    prev() {
      if (this.isVideoChatEnabled || this.joined) {
        this.leave().then(() => {
          this.janusRoom.getConfig().server = null;
          this.checkStreams();
          this._prev();
        });
      } else {
        this._prev();
      }
    }

    next() {
      if (this.isVideoChatEnabled || this.joined) {
        this.leave().then(() => {
          this.checkStreams();
          this._next();
        });
      } else {
        this._next();
      }
    }

    _prev() {
      this.matchIndex--;
      if (this.matchIndex < 0) {
        this.matchIndex = 0;
      }
      this.matchToken = this.availableMatches[this.matchIndex].match_token;
      console.log("prev", this.matchToken);
    }

    _next() {
      this.matchIndex++;
      if (this.matchIndex >= this.availableMatches.length) {
        this.matchIndex = 0;
      }
      this.matchToken = this.availableMatches[this.matchIndex].match_token;
      console.log("next", this.matchToken);
    }

    checkStreams() {
      this.sendAudio = true;
      this.sendVideo = true;
      /*
      if (!this.sendVideo && !this.sendAudio) {
        this.sendAudio = true;
      }
      */
    }

    viewProfile(user) {
      const { user_token } = user;
      const first_name = user.profile.first_name;
      const last_name = user.profile.last_name;
      const nickname = user.profile.nickname;
      const photo = user.profile.photo_1;
      this.userObject = [{ first_name, last_name, nickname, photo, user_token }];
      this.active = this.userObject.length <= 1;
      this.showProfileViewer = true;
    }

    async loadMyProfile() {
      const result = await UserModule.getProfile();
      if (!result.error) {
        return result.data;
      } else {
        console.error("ERROR loadMyProfile", result.error);
      }
    }

    async getThreadToken(matchToken) {
      const { error, data } = await ChatModule.getThreadToken({ matchToken });
      if (!error) {
        return data;
      } else {
        console.log(error);
      }
    }

    async loadMatches(day, section) {
      const params = { day, section };
      const { error, data } = await MatchModule.getDayMatches(params);
      if (error) {
        console.error(error);
      } else {
        if (data === "not_exists") {
          console.log("matches not exists for section", section, day);
          return;
        }
        const { matches, overlaps } = data;
        console.log("found matches for section", section, day, { matches, overlaps });
        if (matches) {
          this.availableMatches = this.availableMatches.concat(matches);
          this.matchIndex = 0;
          this.matchToken = this.availableMatches[0].match_token;
        }
      }
    }

    setJanusServer(server: string) {
      this.janusServer = server;
    }
  }
</script>

<style
  lang="scss"
  scoped>
  @import "https://use.fontawesome.com/releases/v5.0.13/css/all.css";

  .chat-control {
    margin-left: 20px;
  }

  /*
    .match-type {
      width: 25px;
      height: 25px;
      flex: unset !important;
    }
  */

  .user-chat-name {
    padding: 4px 10px;
    font-weight: 400;
  }

  .chat-name {
    position: absolute;
    right: 0;
    padding: 4px 10px;
    font-weight: 500;
  }

  .other-match {
    color: $primary_color;
    font-weight: bolder;
    font-size: 90%;
    line-height: 2;
    user-select: none;
  }

  .control-btn {
    @extend %gradient;
    color: white;
  }

  .user-list-slide {
    margin-top: 10px;
    margin-bottom: 35px;
    max-width: 575px;
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

  .set-result-title {
    font-size: 22px;
    color: #788ea8;
    font-weight: 400;
    line-height: 1.2;
  }

  .set-result-coin {
    color: #2aadfb;
    font-size: 36px;
    font-weight: 700;
    line-height: 1.2;
  }

  .set-result-coin {
    display: flex;
    align-items: center;

    &:before {
      content: "";
      display: block;
      width: 2px;
      height: 32px;
      background: #788ea8;
      margin-right: 12px;
    }
  }
</style>
