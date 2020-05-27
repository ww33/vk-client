<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <h2 class="view-title">Знаки зодиака, %</h2>
      </v-col>
    </v-row>
    <v-row class="zodiac-stat-list">
      <v-col cols="10">
        <v-row class="d-flex align-center" no-gutters v-for="item in zodiacSignsPercent">
          <v-col cols="3"><span class="percent-title">{{item.sign}}</span></v-col>
          <v-col cols="6">
            <div class="zodiac-stat-slider">
              <span class="zodiac-stat-slider__spinner" style="width:50%;" ></span>
            </div>
          </v-col>
          <v-col cols="1">
            <span class="percent-text">{{item.percent}}</span>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="d-flex justify-end">
<!--      <v-btn class="custom-btn-back">Назад</v-btn>-->
    </v-row>

  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {VkModule} from '@/store/modules/vk';

  @Component
  export default class Statistics extends Vue {

    get zodiacSignsPercent(){
      return VkModule.zodiacSignsPercent
    }
  }
</script>


<style lang="scss" scoped>
  .percent-title{
    font-size: 22px;
    color: #788EA8;
    display: block;
    width: 100%;
  }
  .percent-text{
    font-size: 22px;
    color: #000;
    padding-left: 16px;
    display: block;
    width: 100%;
  }
  .zodiac-stat-slider{
    width: 100%;
    height: 16px;
    background: #F2F2F2;
    box-shadow: inset 1px 1px 2px rgba(2, 21, 44, 0.19);
    border-radius: 102.077px;
    position: relative;
  }
  .zodiac-stat-slider__spinner{
    display: block;
    height: 16px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    background: linear-gradient(175.21deg, #4690FF 20.7%, #16C1F8 96.61%);
    box-shadow: inset 1px 1px 2px rgba(2, 21, 44, 0.19);
    border-radius: 102.077px;
  }
  .stat-row{
    padding-bottom: 59px;
  }

</style>
