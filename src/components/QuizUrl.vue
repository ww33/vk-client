<template>
  <v-container no-gutters>
    <v-row>
      <v-col cols="4">
        <v-card v-card hover height="100%" class="card-outter quiz-img">
          <label class="quiz-img__label">
            <input @input="changeChoice(1)" type="radio" value="1" name="quiz-img-group" class="quiz-img__input"/>
            <span class="quiz-img__radio-icon"></span>
            <img :src="getSrc(0)" alt="" class="quiz-img__item">
          </label>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card v-card hover height="100%" class="card-outter quiz-img">
          <label class="quiz-img__label">
            <input @input="changeChoice(2)" type="radio" value="2" name="quiz-img-group" class="quiz-img__input"/>
            <span class="quiz-img__radio-icon"></span>
            <img :src="getSrc(1)" alt="" class="quiz-img__item">
          </label>
        </v-card>
      </v-col>

      <v-col cols="4">
        <v-card v-card hover height="100%" class="card-outter quiz-img">
          <label class="quiz-img__label">
            <input @input="changeChoice(3)" type="radio" value="3" name="quiz-img-group" class="quiz-img__input"/>
            <span class="quiz-img__radio-icon"></span>
            <img :src="getSrc(2)" alt="" class="quiz-img__item">
          </label>
        </v-card>
      </v-col>

    </v-row>

  </v-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  @Component
  export default class QuizUrl extends Vue {
    @Prop() answers!: Array<string>;
    choice = null;

    getSrc(index) {
      return this.answers[index]
    }


    changeChoice(val) {
      this.$emit('changeChoice', val);
    }


  }

</script>


<style lang="scss" scoped>


  .quiz-img {
    border-radius: 20px !important;
    overflow: hidden;
    height: auto !important;

    &__input {
      display: none;

      &:checked + .quiz-img__radio-icon:after {
        opacity: 1;
        transition: opacity 0.3s;
      }
    }

    &__item {
      display: block;
      width: 100%;
      height: auto;
    }

    &__label {
      cursor: pointer;
      display: block;
      position: relative;
    }

    &__radio-icon {
      position: absolute;
      bottom: 20px;
      left: 20px;
      width: 32px;
      height: 32px;

      &:before {
        content: '';
        display: inline-block;
        width: 32px;
        height: 32px;
        background: #E7E7E7;
        box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.14);
        border-radius: 50%;
        margin-right: 15px;
      }

      &:after {
        content: '';
        width: 32px;
        height: 32px;
        border-radius: 50%;
        position: absolute;
        left: 0px;
        top: 0px;
        background: linear-gradient(120.5deg, #4690FF 20.7%, #16C1F8 96.61%);
        box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.14);
        opacity: 0;
        transition: opacity 0.3s;
      }
    }
  }

</style>

