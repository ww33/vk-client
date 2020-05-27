<template>
  <v-avatar-uploader
    :avatar="{ size: size ? size : 90 }"
    :url="src"
    :request="upload"
    max-size="1024"
    @success="success"
    @failed="failed">
    <template v-slot:none>
      <slot>
        <v-icon>mdi-plus-circle-outline</v-icon>
      </slot>
    </template>
  </v-avatar-uploader>
</template>

<script lang="ts">

  import { Component, Prop, Vue } from "vue-property-decorator";
  import axios from "axios";
  import VAvatarUploader from "vuetify-avatar-uploader/src/VAvatarUploader.vue";

  @Component({
    components: {
      VAvatarUploader,
    },
  })
  export default class UserPhoto extends Vue {

    uploadUrl = "https://api.myqu.inachi.eu/upload.php";

    @Prop({ type: String })
    src!: string;

    @Prop({ type: Number })
    size: number;

    @Prop({ type: Number })
    index: number;

    async upload(form, config) {
      return await axios.post(this.uploadUrl, form, config);
    }

    success({ data }) {
      this.src = "https://api.myqu.inachi.eu/" + data.path;
      this.$emit("update", this.src, this.index);
    }

    failed(error) {
      alert(error);
    }
  }
</script>

<style scoped></style>
