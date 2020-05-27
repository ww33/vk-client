<template>
  <v-container
    class="chat-box pa-0 ">
    <v-row
      no-gutters
      align="center"
      style="position: relative">
      <v-textarea
        v-model="message"
        :disabled="disabled"
        class="input-textarea"
        hide-details
        auto-grow
        rows="1"
        no-resize
        rounded
        filled
        placeholder="Сообщение"
        @keypress.enter.prevent="sendMessage"/>
      <v-btn
        :loading="sending"
        dark
        fab
        auto-grow
        small
        height="30px"
        width="30px"
        class="gradient-button send-button"
        @click="sendMessage()">
        <v-icon size="18">
          {{ sendIcon }}
        </v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";

  @Component
  export default class ChatBox extends Vue {
    @Prop({ required: false, type: Boolean }) sending = false;
    @Prop({ type: Boolean }) disabled = true;

    sendIcon = "mdi-send";
    message = "";

    @Watch("disabled")
    clear(disabled) {
      if (disabled) {
        this.message = "";
      }
    }

    sendMessage() {
      if (this.message.length > 0) {
        this.$emit("message", this.message.trim());
      }
      this.message = "";
    }
  }
</script>

<style lang="scss">
  .chat-box {

    .input-textarea {
      margin-right: 40px;

      &.v-text-field--filled > .v-input__control {

        > .v-input__slot {
          min-height: 30px !important;
          padding: 0 16px;
          background-color: white;

          textarea {
            margin: 0 !important;
            line-height: 1;
            font-size: 80%;
            padding: 10px 10px 10px 0;
          }
        }

        > .v-input__slot:hover {
          background: white !important;
        }
      }
    }

    .send-button {
      position: absolute;
      right: 0;
    }
  }
</style>
