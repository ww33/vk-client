<template>
  <v-sheet id="playground-example" class="overflow-y-auto" max-height="600">
    <v-container class="pa-0">
      <v-tabs-items v-model="tabs" style="height: 700px;">
        <v-tab-item key="0">
          <Camera></Camera>
        </v-tab-item>
        <v-tab-item key="1">
          <Chats></Chats>
        </v-tab-item>
        <v-tab-item key="2">
          <Status></Status>
        </v-tab-item>
        <v-tab-item key="3">
          <Calls></Calls>
        </v-tab-item>
      </v-tabs-items>
      <v-btn v-if="tab === 1" color="orange lighten-2" class="action-1" fixed bottom dark right fab>
        <v-icon class="flip-icon">mdi-android-messages</v-icon>
      </v-btn>
      <template v-if="tab === 2">
        <v-btn color="grey lighten-3" class="action-secondary mr-2" fixed bottom small dark right fab>
          <v-icon color="grey darken-1">mdi-pencil</v-icon>
        </v-btn>
        <v-btn color="orange lighten-2" class="action-primary" fixed bottom dark right fab>
          <v-icon>mdi-instagram</v-icon>
        </v-btn>
      </template>
      <v-btn v-if="tab === 3" color="orange lighten-2" class="action-primary" fixed bottom dark right fab>
        <v-icon>mdi-phone-plus</v-icon>
      </v-btn>
    </v-container>
  </v-sheet>
</template>

<script lang="ts">
	import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
	import Camera from './Camera.vue';
	import Chats from './Chats.vue';
	import Status from './Status.vue';
	import Calls from './Calls.vue';

	@Component({
		components: {
			Camera,
			Chats,
			Status,
			Calls
		}
	})
	export default class TabHolder extends Vue {
		@Prop({ default: 0 }) readonly tab!: number;

		tabs = null;

		mounted() {
			this.tabs = this.tab;
		}

		@Watch('tab')
		onTabChanged(val: string, oldVal: string) {
			this.tabs = val
		}
		@Watch('tabs')
		onTabsChanged(val: string, oldVal: string) {
			this.$emit('update:tabValue', val);
		}


	}
</script>

<style scoped>
  .action-secondary {
    bottom: 85px !important;
  }
</style>
