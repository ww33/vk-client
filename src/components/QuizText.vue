<template>
  <v-container class="quiz-cont">
    <v-row no-gutters>
      <v-col >
        <v-item-group class="radio-quest">
          <label v-for="(item, key)  in answers" v-bind:key="key" class="radio-quest__label">
            <input type="radio" :value="key" name="quiz-group" class="radio-quest__input" v-model="choice"/>
            <span class="check-icon"></span>
            <span v-html="item" class="radio-quest__label-text"></span>
          </label>
        </v-item-group>
      </v-col>

    </v-row>
  </v-container>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';

  @Component
  export default class QuizText extends Vue {
    @Prop() answers!: Array<string>;
    choice = null;

    @Watch('choice')
    changeChoice(val: string, oldVal: string) {
      if (val !== null) {
        this.$emit('changeChoice', val + 1);
      }
    }

    @Watch('answers')
    changeAnswers(val: string, oldVal: string) {
      this.choice = null;
    }

    onChoice() {

    }

  }

</script>


<style lang="scss" scoped>

  .radio-quest__label {
    margin-bottom: 20px;
    display:flex;
    align-items: center;
    background: #FFFFFF;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    padding: 5px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    position: relative;
    cursor: pointer;
  }


  .check-icon{
    width: 32px;
    height: 32px;
    display: block;
    margin-right: 20px;
    position: relative;
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
  .radio-quest__input {
    display: none;
  }

  .radio-quest__input:checked + .check-icon:after {
    opacity: 1;
    transition: opacity 0.3s;
  }

  .quiz-cont {
    padding: 0px;
  }


</style>

