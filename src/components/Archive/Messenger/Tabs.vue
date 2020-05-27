<template>
  <v-tabs v-model="tabs" :background-color="mainColor" centered center-active dark slider-size="3">
    <v-tab key="0">
      <v-icon>mdi-camera</v-icon>
    </v-tab>
    <v-tab key="1">Chats</v-tab>
    <v-tab key="2">Status</v-tab>
    <v-tab key="3">Calls</v-tab>
  </v-tabs>
</template>

<script lang="ts">
	import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
  import {mainColor} from '@/models/Constants'
	@Component
	export default class Tabs extends Vue {
		@Prop({ default: 0 }) readonly tab!: number;

	  mainColor = mainColor
		tabs = null;

		mounted() {
			this.tabs = this.tab;
		}

		@Watch('tab')
		onTabChanged(val: string, oldVal: string) {
			this.tabs = val;
		}

		@Watch('tabs')
		onTabsChanged(val: string, oldVal: string) {
			this.$emit('update:tabValue', val);
		}

	}
</script>
