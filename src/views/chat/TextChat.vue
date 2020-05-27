<template>
  <v-container
    class="chat-wrap fill-height pa-0">
    <v-row
      no-gutters
      class="header px-2 py-1 elevation-2">
      <slot/>
    </v-row>
    <v-row
      ref="messages"
      no-gutters
      class="messages">
      <v-col align-self="end">
        <template v-for="(message, index) in messages">
          <v-card
            v-if="message.direction === 'incoming'"
            :key="index"
            :class="{ 'chat-bubble': firstDirection(message, index) }"
            class="mx-3 mb-1 px-2 py-1 float-left"
            min-width="50%"
            max-width="80%">
            <v-card-subtitle class="user-name py-1 px-0">
              {{ message.userName }}
            </v-card-subtitle>
            <div
              v-linkified
              class="hide-overflow">
              {{ message.text }}
            </div>
            <span class="float-right mt-1 pl-2">
              <span class="grey--text text--darken-1 time">
                {{ message.time }}
              </span>
            </span>
          </v-card>
          <v-card
            v-else-if="message.direction === 'outgoing'"
            :key="index"
            :class="{ 'chat-bubble': firstDirection(message, index) }"
            class="mx-3 mb-1 px-2 py-1 float-right"
            min-width="50%"
            max-width="80%">
            <div
              v-linkified
              class="hide-overflow">
              {{ message.text }}
            </div>
            <span class="float-right mt-1 pl-2">
              <span class="grey--text text--darken-1 time">
                {{ message.time }}
              </span>
              <!--
              <v-icon
                v-if="message.status === 'received'"
                size="18"
                class="mt-n1"
                color="grey lighten-0">mdi-check-all</v-icon>
              <v-icon
                v-else-if="message.status === 'read'"
                size="18"
                class="mt-n1"
                color="blue lighten-2">mdi-check-all</v-icon>
              -->
            </span>
          </v-card>
        </template>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="chat-controls">
      <ChatBox
        :sending="sending"
        :disabled="threadToken == null"
        @message="addMessage"/>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import ChatBox from "./ChatBox.vue";
  import { ChatModule } from "@/store/modules/chat";
  import dayjs from "dayjs";
  import { getPrintableName } from "@/lib/utils";

  @Component({
    components: {
      ChatBox
    }
  })
  export default class TextChat extends Vue {

    @Prop()
    threadToken: string;

    @Prop()
    users = [];

    messages = [];
    messagesId = [];
    sending = false;

    @Watch("threadToken")
    loadChat(value) {
      console.log("init chat", this.threadToken);
      if (value) {
        this.loadMessages();
      }
    }

    created() {
      ChatModule.subscribeToMessages((message) => {
        if (message.thread_token === this.threadToken) {
          console.log("New message in thread", this.threadToken, message);
          this.pushMessage(message);
        }
      });
    }

    loadMessages() {
      this.messages = [];
      this.messagesId = [];
      ChatModule.loadMessages(this.threadToken).then((result) => {
        const messages = result.data.messages;
        if (messages) {
          for (const msg of messages) {
            this.pushMessage(msg);
          }
        }
      });
    }

    addMessage(message) {
      this.sending = true;
      ChatModule.postMessage(
        {
          threadToken: this.threadToken,
          text: message
        }
      ).then((result) => {
        this.sending = false;
        if (result.error) {
          console.error(result.error);
        } else {
          this.pushMessage(result.data);
        }
      });
    }

    @Watch("messages")
    onMessageUpdate() {
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    }

    scrollToBottom() {
      const element = this.$refs.messages as HTMLDivElement;
      element.scrollTop = element.scrollHeight + 20000;
    }

    pushMessage(msg) {
      if (msg.msg_id) {
        if (this.messagesId.includes(msg.msg_id)) {
          return;
        }
        this.messagesId.push(msg.msg_id);
      }
      const user = this.users.find((it) => it.user_token == msg.user_id);
      if (user) {
        const profile = user.profile;
        this.messages.push({
          msgId: msg.msg_id,
          userId: msg.user_id,
          direction: msg.my_msg ? "outgoing" : "incoming",
          userName: profile ? getPrintableName(profile) : "-",
          time: dayjs(msg.time * 1000).format("HH:mm"),
          text: msg.text
        });
      }
    }

    firstDirection(message: any, index: number): boolean {
      if (index == 0) {
        return true;
      }
      return message.direction != this.messages[index - 1].direction;
    }
  }
</script>

<style
  lang="scss"
  scoped>

  .chat-wrap {
    width: 100%;
    overflow: hidden;
    position: relative;
    border-radius: 15px;
    box-sizing: border-box;
    font-size: 90%;

    $header: 35px;
    $footer: 50px;

    .header {
      @extend %gradient;
      position: absolute;
      top: 0;
      width: 100%;
      align-items: center;
      height: $header;
      color: white;
      z-index: 1;
    }

    .messages {
      position: absolute;
      top: $header;
      height: calc(100% - #{$header} - #{$footer});
      background-color: #ebebeb;
      overflow: hidden;
      overflow-y: scroll;
      width: 100%;
      font-size: 80%;
      padding: 5px 0;
    }

    .chat-controls {
      min-height: $footer;
      width: 100%;
      bottom: 0;
      position: absolute;
      background-color: #ebebeb;
      padding: 10px;
      box-shadow: 0 1px 8px 0 rgba(0, 0, 0, .12);
    }

    .messages::-webkit-scrollbar-track {
      border-radius: 5px;
    }

    .messages::-webkit-scrollbar {
      width: 5px;
    }

    .messages::-webkit-scrollbar-thumb {
      border-radius: 5px;
      -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .3);
      background-color: $primary_color;
    }

    .hide-overflow {
      display: inline;
      overflow: hidden;
    }

    .user-name {
      color: $primary_color;
      font-size: 90%;
      line-height: 80%;
      font-weight: bold;
    }

    .time {
      font-size: 80%;
    }

    .float-left.v-card {
      .grey--text {
        font-weight: 500;
      }
    }

    .float-right.v-card {
      background: linear-gradient(156.66deg, #4690FF 20.7%, #19BDF8 96.61%) !important;

      .hide-overflow {
        color: #fff;
      }

      .grey--text {
        color: #fff !important;
      }
    }
  }
</style>
