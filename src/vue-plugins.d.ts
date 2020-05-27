import Vue from 'vue';
declare module 'vue/types/vue' {
  interface Vue {
    $inform: (object) => Promise<any>;
    $confirm: (object) => Promise<any>;
    $connect;
  }
}
