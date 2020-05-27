<template>
  <v-container>
    <v-row no-gutters>
      <v-col>

        <v-btn
            class="buttonFind"
            rounded
            color="primary"
            dark>
          Задружись по интересам
        </v-btn>

      </v-col>

      <v-col>
        <v-toolbar-title class="changesTitle">В вопросах спрятаны пасхалки</v-toolbar-title>


      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
	import { Component, Vue } from 'vue-property-decorator';



	@Component
	export default class New extends Vue {

	}
</script>


<style lang="scss" scoped>

</style>
