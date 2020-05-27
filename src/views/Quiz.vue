<template>
  <v-container
    fluid
    class="main-content">
    <v-row no-gutters>
      <v-col cols="12">
        <h1 class="view-title">
          Ищем друзей
        </h1>
      </v-col>
    </v-row>

    <v-row no-gutters>
      <v-col cols="3">
        <h2 class="set-title">
          Сет {{ setNum }}
        </h2>
        <v-row
          align="center"
          no-gutters
          class="result-row">
          <v-col>
            <h3 class="set-result-title">
              Есть
              <br />
              cовпадений
            </h3>
          </v-col>
          <v-col>
            <h4 class="set-result-coin">
              {{ match_Ap }}
            </h4>
          </v-col>
        </v-row>
        <v-row
          align="center"
          no-gutters
          class="result-row">
          <v-col>
            <h3 class="set-result-title">
              Cовпадений
              <br />
              онлайн
            </h3>
          </v-col>
          <v-col>
            <h4 class="set-result-coin">
              0
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!--
            <a
              href="#"
              class="share-btn d-flex align-center">
              <span class="share-icon"></span>
              Поделиться в ленте
            </a>
            -->
          </v-col>
        </v-row>
      </v-col>
      <v-col
        cols="8"
        class="q-wrap">
        <v-row no-gutters>
          <v-col cols="12">
            <h5
              v-if="questNum !== 0"
              class="quest-text">
              {{ questNum }}. {{ quest }}
            </h5>
          </v-col>
        </v-row>
        <div v-if="questNum !== 0">
          <QuizText
            v-if="answersType === 'txt'"
            :answers="answers"
            @changeChoice="changeChoice" />
          <QuizUrl
            v-else-if="answersType === 'url'"
            :answers="answers"
            @changeChoice="changeChoice" />
          <h3 v-else>
            Wrong answer type
          </h3>
        </div>
        <div class="d-flex justify-space-between quiz-nav-wrap">
          <!--          <button
                      @click="goBack"
                      v-if="questNum ===1"
                      class="btn-back"
                    >Назад</button>-->
          <button
            class="custom-btn"
            :disabled="!choice"
            @click="onNext">
            Далее
          </button>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Prop, Vue, Watch } from "vue-property-decorator";
  import { SetsModule } from "@/store/modules/sets";
  import { AppModule } from "@/store/modules/app";
  import QuizText from "@/components/QuizText.vue";
  import QuizUrl from "@/components/QuizUrl.vue";

  @Component({ components: { QuizText, QuizUrl } })
  export default class Quiz extends Vue {
    @Prop() section!: string;

    choice = null;

    // _matchAp = 0
    @Watch("choice")
    watchChoice(val) {
      // console.log("choice =", val);
      // console.log("choice===null", val === null);
    }

    get match_Ap() {
      // console.log('matchUp',SetsModule.matchUp)
      return SetsModule.matchUp;
    }

    get answersType() {
      if (this.currentQuest && this.currentQuest.answers && this.currentQuest.answers.length > 0) {
        const firstAnswer = this.currentQuest.answers[0];
        if (firstAnswer.type === "txt") {
          return "txt";
        } else if (firstAnswer.type === "url") {
          return "url";
        } else {
          return "finish";
        }
      } else {
        return "finish";
      }
    }

    get answers() {
      const result = [];
      if (this.currentQuest && this.currentQuest.answers) {
        for (const item of this.currentQuest.answers) {
          result.push(item.data);
        }
      }
      return result;
    }

    get quest() {
      return this.currentQuest ? this.currentQuest.quest + "..." : "";
    }

    get setNum() {
      return this.currentQuest ? this.currentQuest.set_num : "";
    }

    get currentQuest() {
      return SetsModule.currentQuest(parseInt(this.section));
    }

    get questNum() {
      return SetsModule.questNum(parseInt(this.section));
    }

    get currentSection() {
      return SetsModule.currentSection;
    }

    async onNext() {
      const params = { section: parseInt(this.section), set_num: this.setNum, choice: this.choice };
      const { error, data } = await SetsModule.registerAnswerAndGetNextQuest(params);
      if (error) {
        if (AppModule.showLogs) console.error(error);
      } else {
        if (data.hasOwnProperty("route")) {
          await this.$router.push(data.route);
        }
      }
    }

    changeChoice(choice) {
      this.choice = choice;
    }
  }
</script>

<style
  lang="scss"
  scoped>
  .quiz-cont {
    height: 186px;
  }

  .q-wrap {
    padding-left: 65px;
  }

  .share-icon {
    display: block;
    width: 32px;
    min-width: 32px;
    height: 26px;
    //noinspection CssUnknownTarget
    background: url("/svg/share-icon.svg") no-repeat center center;
    background-size: cover;
    margin-right: 14px;
  }

  .share-btn {
    display: block;
    font-weight: 500;
    font-size: 14px;
    text-decoration-line: underline;
    color: #666666;
    padding-top: 53px;
    transition: all 0.3s;

    &:hover {
      opacity: 0.7;
      transition: all 0.3s;
    }
  }

  .quiz-nav-wrap {
    padding-top: 70px;
  }

  .next-btn {
    display: block;
    padding: 5px 25px !important;
    background: linear-gradient(156.66deg, #4690ff 20.7%, #16c1f8 96.61%);
    border-radius: 73px;
    font-weight: bold;
    font-size: 28px;
    color: #fff !important;
    cursor: pointer;
    outline: none;
    width: 193px;
    height: 49px;
  }

  .btn-back {
    font-weight: 700;
    font-size: 28px;
    text-align: center;
    color: #788ea8;
    display: block;
    padding: 5px 25px !important;
    border: 1px solid #788ea8;
    border-radius: 73px;
    cursor: pointer;
    outline: none;
  }

  .set-title {
    font-size: 38px;
    color: $start-color;
    font-weight: 400;
    padding-bottom: 20px;
  }

  .quest-text {
    font-weight: 400;
    font-size: 17px;
    line-height: 27px;
    padding-bottom: 30px;
    color: $black;
    height: 110px;
    overflow: hidden;
    display: flex;
    align-items: center;
  }

  .radio-quest__label-text {
    font-size: 15px;
  }
</style>
