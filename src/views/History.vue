<template>
  <v-container
    class="pa-0"
    fluid>
    <v-row
      no-gutters
      class="filters">
      <div class="filter-title-wrap d-flex justify-space-between align-center">
        <div class="d-flex align-center">
          <h3 class="filters-title">Фильтры:</h3>
          <v-item-group class="radio-filter">
            <!--                    <label class="radio-filter__label">
                                    <input type="checkbox" value="1" name="quiz-group" class="radio-filter__input"/>
                                    <span class="radio-filter__label-text">Все</span>
                                </label>-->
            <label class="radio-filter__label">
              <input
                type="checkbox"
                v-model="filtred_rem"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">Добавленные</span>
            </label>
            <label class="radio-filter__label">
              <input
                type="checkbox"
                v-model="filtred_new"
                name="quiz-group"
                class="radio-filter__input" />
              <span class="radio-filter__label-text">Удалившиеся</span>
              <!--<span class="radio-filter__label-text">Удалившиеся <span class="del-coin">12</span></span>-->
            </label>
          </v-item-group>

        </div>

        <div class="d-flex align-center">
          <h3 class="filters-title">Показывать архив:</h3>
          <input
            type="checkbox"
            :id="12"
            class="add-check-item">
          <label
            :for="12"
            class="add-check-label"></label>
        </div>
      </div>
    </v-row>
<!--
    <v-row
      no-gutters
      class="archives-btn-wrap d-flex justify-end align-center">

      &lt;!&ndash;      <label class="radio-filter__label">&ndash;&gt;
      &lt;!&ndash;        <input type="checkbox" value="1" name="quiz-group" class="radio-filter__input"/>&ndash;&gt;
      &lt;!&ndash;        <span class="radio-filter__label-text">Cкрыть в архив</span>&ndash;&gt;
      &lt;!&ndash;      </label>
      <v-btn
        @click="hideInArchive"
        class="custom-btn">Скрыть в архив
      </v-btn>
      <label
        style="margin-top: 6px; margin-left: 3px"
        class="radio-filter__label">
        <input
          type="checkbox"
          v-model="date_filter_reverse"
          name="quiz-group"
          class="radio-filter__input"/>
        <span class="radio-filter__label-text label-big">Показать архивные</span>
      </label> &ndash;&gt;
    </v-row>
-->

    <v-row no-gutters>
      <v-container fluid class="main-content">
        <v-col
          cols="4"
          style="text-align: center;">
          <h2 class="list-title">Друзей <br>сейчас</h2>
          <h1 class="list-coin">{{allFriendsCount}}</h1>
          <v-row
            align="center"
            no-gutters
            class="set-result-row">
            <v-col cols="7">
              <h3 class="set-result-title">Добавилось</h3>
            </v-col>
            <v-col cols="5">
              <h4 class="set-result-coin">{{addedFriendsCount}}</h4>
            </v-col>
          </v-row>
          <v-row
            align="center"
            no-gutters
            class="set-result-row">
            <v-col cols="7">
              <h3 class="set-result-title">Удалилось</h3>
            </v-col>
            <v-col cols="5">
              <h4 class="set-result-coin">{{removedFriendsCount}}</h4>
            </v-col>
          </v-row>
          <v-row
            align="center"
            no-gutters
            class="set-result-row">
            <v-col cols="7">
              <h3 class="set-result-title">Добавилось <br> через КУ!</h3>
            </v-col>
            <v-col cols="5">
              <h4 class="set-result-coin">{{addedFromKu}}</h4>
            </v-col>
          </v-row>
          <v-btn
            @click="goStat"
            class="custom-btn custom-btn_history"> Кто все эти люди?
          </v-btn>
        </v-col>

        <v-col cols="8">
          <perfect-scrollbar class="scrollbar">
            <v-list class="list">
              <v-list-item
                v-for="item in history"
                :key="item.user_id"
                @click=""
                class="list__item"
              >
                <v-card class="v-card">
                  <div class="d-flex flex-no-wrap align-center">
                    <v-avatar
                      class="avatar-photo-wrap"
                      size="66">
                      <v-img :src="item.photo"></v-img>
                    </v-avatar>
                    <div class="d-flex flex flex-column">
                      <v-card-subtitle
                        class="card-first-name"
                        v-text="item.first_name+ ' ' +item.last_name"
                      ></v-card-subtitle>
                      <small class="last-online">{{item.last_seen }}</small>
                    </div>
                    <v-spacer></v-spacer>
                    <v-icon :style="iconStyle(item.type)">{{item.type === "a"?
                                                          "mdi-arrow-left-bold-circle":"mdi-arrow-right-bold-circle"}}
                    </v-icon>
                    <div class="icons justify-center">
                      <small class="text-add-remove">{{item.type === "a"? "добавился":"удалился"+
                                                     "&nbsp"+
                                                     "&nbsp"}}</small>
                      <small class="date-add-remove">{{dateAsString(item.date) }}</small>
                    </div>
                  </div>
                </v-card>
              </v-list-item>
            </v-list>
          </perfect-scrollbar>
        </v-col>
      </v-container>
    </v-row>
  </v-container>
</template>


<script lang="ts">

  import { Component, Vue, Watch } from "vue-property-decorator";
  import { VkModule } from "@/store/modules/vk";
  import vkService from "@/services/vkService";
  import dayjs from "dayjs";
  import { AppModule } from "@/store/modules/app";

  @Component
  export default class History extends Vue {

    ignoreWatchers = false;
    filtred_new = false;
    filtred_rem = false;
    date_filter_reverse = false;

    @Watch("filtred_new")
    change_filtred_new(val: string, oldVal: string) {
      // console.log('filtred_new', val)
      if (!this.ignoreWatchers) this.getHistory(true);
    }

    @Watch("filtred_rem")
    change_filtred_rem(val: string, oldVal: string) {
      // console.log('filtred_rem', val)
      if (!this.ignoreWatchers) this.getHistory(true);
    }

    @Watch("date_filter_reverse")
    change_date_filter(val: string, oldVal: string) {
      this.getHistory();
    }

    get history() {
      return VkModule.history;
    }

    get removedFriendsCount() {
      return VkModule.removedFriendsCount;
    }

    get addedFriendsCount() {
      return VkModule.addedFriendsCount;
    }

    get addedFromKu() {
      return VkModule.addedFromKu;
    }

    get allFriendsCount() {
      return VkModule.allFriendsCount;
    }

    async getHistory(notSync = false) {
      if (notSync == true) {
        const { error: errorHistory, data: dataHistory } = await vkService.getHistory({
          filtred_new: this.filtred_new,
          filtred_rem: this.filtred_rem,
          date_filter: !this.date_filter_reverse,
        });

      } else {
        const { error: errorSync, data: dataSync } = await vkService.friendsSync();
        // console.log('sync_friends',{errorSync, dataSync})
        if (!errorSync) {
          const { error: errorHistory, data: dataHistory } = await vkService.getHistory({
            filtred_new: this.filtred_new,
            filtred_rem: this.filtred_rem,
            date_filter: !this.date_filter_reverse,
          });
          if (errorHistory && AppModule.showLogs) console.error("errorHistory", errorHistory);
          // console.log('get_friends_history',{errorHistory, dataHistory});
        } else {
          if (errorSync && AppModule.showLogs) console.error("errorSync", errorSync);
        }
      }

    }

    //TODO use
    async clearFilters() {
      this.ignoreWatchers = true;
      this.filtred_new = false;
      this.filtred_rem = false;
      await this.getHistory().catch(e => console.log(e));
      this.ignoreWatchers = false;
    }

    //TODO use
    async hideInArchive() {
      try {
        await vkService.setMarker();
        await this.getHistory();
      } catch (e) {
        console.error(e);
      }
    }

    created(): void {
      // this.getHistory();
      // this.clearFilters()
    }

    goStat() {
      this.$router.push("/statistics");
    }

    iconStyle(type) {
      return {
        marginRight: "5px",
        color: type === "a" ? "#39B0F3" : "#EEA8C1",
      };
    }

    dateAsString(date) {
      return dayjs(date * 1000).format("YYYY-MM-DD");
    }

  }
</script>

<style
  lang="scss"
  scoped>
  .avatar-photo-wrap {
    margin: 10px;
  }

  .theme--light.v-list {
    background: transparent;
  }

  .custom-btn_history {
    margin-top: 25px;
  }

  .add-check-item {
    display: none;

    &:checked + .add-check-label {
      &:before {
        background: #4690FF;
        transition: all 0.3s;
      }

      &:after {
        content: '';
        transform: translateX(17px);
        transition: all 0.3s;
      }
    }
  }

  .add-check-label {
    position: relative;
    cursor: pointer;

    &:before {
      content: '';
      display: block;
      width: 45px;
      height: 27px;
      background: #FFFFFF;
      border: 1px solid #C0C0C0;
      box-shadow: inset 0px 0px 12px rgba(0, 0, 0, 0.1);
      border-radius: 95px;
      transition: all 0.3s;
    }

    &:after {
      content: '';
      display: block;
      width: 23px;
      height: 23px;
      background: #FFFFFF;
      border: 1px solid #C0C0C0;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
      border-radius: 49px;
      position: absolute;
      left: 3px;
      top: 2px;
      transition: all 0.3s;
    }
  }

  .del-coin {
    display: flex;
    align-items: center;

    &:before {
      content: '';
      display: inline-block;
      width: 1px;
      height: 12px;
      background: #B8B8B8;
      margin: 0 5px;
    }
  }

  .scrollbar .v-icon {
    font-size: 26px;
  }

  .list__item {
    margin-bottom: 15px;
    border-radius: 20px;
  }

  .theme--light.v-card {
    border-radius: 20px;
  }

  .v-list-item {
    padding: 0 !important;
  }

  .last-online {
    font-size: 12px;
    font-weight: 700;
    color: #949494;
  }

  .list-title {
    font-weight: 300;
    font-size: 28px;
    text-align: left;
    color: #788EA8;
    line-height: 28px;

    &_l {
      font-size: 22px;
      line-height: 25px;
    }
  }

  .list-coin {
    font-weight: 700;
    font-size: 74px;
    color: #4690FF;
    text-align: left;
    line-height: 1;
    padding-bottom: 40px;

    &_l {
      font-size: 69px;
      padding-bottom: 165px;
      line-height: 53px;
    }
  }

  .radio-filter {
    display: flex;
    align-items: center;

    &__input {
      display: none;

      &:checked + .radio-filter__label-text {
        color: #fff;
        background: linear-gradient(161.69deg, #4690FF 20.7%, #16C1F8 96.61%);
      }
    }

    &__label {
      display: block;
      cursor: pointer;
    }

    &__label-text {
      background: #FFFFFF;
      border-radius: 73px;
      padding: 2px 10px;
      color: #B8B8B8;
      font-size: 12px;
      font-weight: 400;
      margin-right: 10px;
      display: flex;
      align-items: center;
    }
  }

  .v-card {

    width: 90vw;
    border-radius: 5px;
  }


  .v-btn__content {
    color: #FFFFFF;
    font-size: 25px;
    font-weight: 400;
  }

  .scrollbar {
    padding-top: 10px;
    padding-bottom: 40px;
    padding-left: 15px;
    padding-right: 21px;
  }

  .list {
    max-height: 600px;

  }

  .card-first-name {
    padding: 0;
    font-size: 17px;
    line-height: 28px;
    color: #2A5885 !important;
    font-weight: 700;
  }

  .icons {
    margin-right: 5px;
    display: flex;
    flex-direction: column;
  }

  .text-add-remove,
  .date-add-remove {
    font-style: italic;
    color: #B8B8B8;
    font-size: 11px;
  }


  .filter-title-wrap {
    width: 100%;
  }

  .label-big {
    font-size: 28px;
  }

  .archives-btn-wrap {
    padding-bottom: 25px;
    padding-right: 21px;

    .radio-filter__label {
      margin-top: 0px !important;
      margin-left: 15px !important;
    }

    .radio-filter__label-text {
      line-height: 1.2;
      padding: 5px 25px !important;
      margin-right: 0px;
      color: #788EA8;
      display: block;
      border: 1px solid #788EA8;
      border-radius: 73px;
      box-shadow: 0 3px 1px -2px rgba(0, 0, 0, .2), 0 2px 2px 0 rgba(0, 0, 0, .14), 0 1px 5px 0 rgba(0, 0, 0, .12);
    }

    .radio-filter__input:checked + .radio-filter__label-text {
      border: 1px solid transparent;
    }
  }
</style>
