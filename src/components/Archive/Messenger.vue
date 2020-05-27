<template>
  <div>
    <Topbar>
      <Tabs :tab="tab" :tab-value.sync="tab"></Tabs>
    </Topbar>
    <TabHolder class="mt-1" :tab="tab" :tab-value.sync="tab"></TabHolder>
  </div>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';
	import Topbar from './Messenger/Topbar.vue';
	import Tabs from './Messenger/Tabs.vue';
	import TabHolder from './Messenger/TabHolder.vue';

	@Component({
		components: {
			Topbar,
			Tabs,
			TabHolder
		}
	})

	export default class Messenger extends Vue {
		tab: number = 1;
	};
</script>
