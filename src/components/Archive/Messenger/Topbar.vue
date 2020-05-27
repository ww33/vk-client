<template>
  <div>
    <!-- hide-on-scroll  -->
    <v-app-bar class="elevation-1"  dark scroll-target="#playground-example">
      <v-toolbar-title>0.1.8</v-toolbar-title>

      <div class="flex-grow-1"></div>

      <v-btn icon @click="onTest">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <Menu :options="options"></Menu>
      <template v-slot:extension>
        <slot></slot>
      </template>
    </v-app-bar>
  </div>
</template>

<script>
	import { Component, Vue } from 'vue-property-decorator';
	import Menu from './Menu.vue';
  import {AlertsModule} from '@/store/modules/alerts'
  import {mainColor} from '@/models/Constants'

	@Component({
		components: {
			Menu
		}
	})
	export default class Topbar extends Vue {
	  mainColor = mainColor

		options = ['New group', 'New Broadcast', 'Starred Messages', 'Settings'];
    onTest(){
      AlertsModule.SET_MESSAGE('onTest')
    	// vk.test()
    }
	}
</script>

<style scoped></style>
