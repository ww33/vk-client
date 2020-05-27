<template>
  <v-container>
    <v-row no-gutters>
      <v-col cols="12">
        <h2 class="view-title">Статистика</h2>
      </v-col>
    </v-row>
    <v-row class="stat-row">
      <v-col cols="5">
        <h2 class="set-title">Пол</h2>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Женщин</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{womenCount}}</h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Мужчин</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{menCount}}</h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Пол не указан</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{genderNotSpecifiedCount}}</h4>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="6">
        <h2 class="set-title">Возраст</h2>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Старшему из друзей</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{maxAge}}</h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Младшему из друзей</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{minAge}}</h4>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters class="set-result-row">
          <v-col cols="7">
            <h3 class="set-result-title">Средний возраст</h3>
          </v-col>
          <v-col cols="5">
            <h4 class="set-result-coin">{{averageAge}}</h4>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex align-center" no-gutters>
        <v-btn disabled="true" class="custom-btn custom-btn_big gradient-button">Графики</v-btn>
        <span class="statistics-text">Полюбоваться  статистикой в графиках</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex align-center" no-gutters>
        <v-btn @click="goZodiac" class="custom-btn custom-btn_big gradient-button">Зодиак</v-btn>
        <span class="statistics-text">Сделать важные выводы по знакам Зодиака</span>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="d-flex align-center" no-gutters>
        <v-btn disabled="true" class="custom-btn custom-btn_big gradient-button">Карта мира</v-btn>
        <span class="statistics-text">Выяснить, как друзья  распределены по карте мира</span>
      </v-col>
    </v-row>
    <v-row>
<!--      <v-col class="d-flex justify-end" no-gutters>
        <v-btn class="custom-btn-back">Назад</v-btn>
      </v-col>-->
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {VkModule} from '@/store/modules/vk';

  @Component
  export default class Statistics extends Vue {

    get menCount (){
      return VkModule.menCount
    }
    get womenCount (){
      return VkModule.womenCount
    }
    get genderNotSpecifiedCount (){
      return VkModule.genderNotSpecifiedCount
    }

    get maxAge (){
      return VkModule.maxAge
    }

    get minAge (){
      return VkModule.minAge
    }
    get averageAge (){
      return VkModule.averageAge
    }
    goZodiac(){
      this.$router.push('/zodiac')
    }

  }
</script>


<style lang="scss" scoped>

  .stat-row{
    padding-bottom: 44px;
  }
  .custom-btn_big{
    width: 100%;
    max-width: 200px;
    display:block;

  }
  .statistics-text{
    max-width: 310px;
    padding-left: 22px;
    font-weight: 300;
    font-size: 14px;
    color: #788EA8;
  }

  .set-title {
    font-size: 38px;
    color: $start-color;
    font-weight: 300;
    line-height: 1;
    padding-bottom: 25px;
  }

  .bigText {
    font-size: 80%;
    text-align: justify;
  }

  .rounded-card {
    border-radius: 90px;
  }

  .icon-circle {
    margin-left: 20px;
    color: #788ea8;
  }

  .card-subtitle {
    color: #788ea8;
  }

  .left-row {
    margin-top: 40px;
  }

  .text-statistics {
    color: #7f94ac;
    margin-top: 50px;
  }
</style>
