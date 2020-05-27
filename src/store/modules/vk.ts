import { Vue } from 'vue-property-decorator';
import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators';
import store from '@/store';
import { AppModule } from "@/store/modules/app";
import { IErrorData } from '@/models/Interfaces'
import { zodiacSignsCounter, roundDecimals } from '@/lib/utils'

export interface IVkState {
}

const name = 'vk';
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Vk extends VuexModule implements IVkState {

  _history = [];
  _friendsIdArray = [];
  _friendsAsMap = {};

  _allFriendsCount = 0
  _removedFriendsCount = 0
  _addedFriendsCount = 0
  _addedFromKu = 0

  // number of men or number of women or gender not specified
  _menCount = 0
  _womenCount = 0
  _genderNotSpecifiedCount = 0
  _maxAge = 0
  _minAge = 0
  _averageAge = 0
  _zodiacSignsPercent: Array<{
    sign: string;
    percent: number;
  }> = []

  get friendsIdArray() {
    return this._friendsIdArray
  }

  get friendsAsMap() {
    return this._friendsAsMap
  }

  get friendInfoById() {
    return (id) => {
      if (id) {
        return this._friendsAsMap[id]
      }
    }
  }

  get allFriendsCount() {
    return this._friendsIdArray.length
  }

  get removedFriendsCount() {
    return this._removedFriendsCount
  }

  get addedFriendsCount() {
    return this._addedFriendsCount
  }

  get addedFromKu() {
    return this._addedFromKu
  }

  get history() {
    return this._history
  }

  @Mutation
  SET_HISTORY(payload) {
    this._history = payload;
  }

  @Mutation
  SET_FRIENDS(payload: any) {
    console.log("payload", payload);
    const idArray = []
    for (const user of payload) {
      console.log("user", user);
      const {id} = user
      if (id) {
        console.log("id", id);
        if (id) {
          Vue.set(this._friendsAsMap, id, user)
          idArray.push(id)
        }
      } else {
        Vue.set(this._friendsAsMap, user, user)
        idArray.push(user);
      }
    }
    console.log("idArray", idArray);
    this._friendsIdArray = idArray
  }

  @Mutation
  SET_ALL_FRIENDS_COUNT(payload: number) {
    this._allFriendsCount = payload
  }

  @Mutation
  SET_REMOVED_FRIENDS_COUNT(payload: number) {
    this._removedFriendsCount = payload
  }

  @Mutation
  SET_ADDED_FRIENDS_COUNT(payload: number) {
    this._addedFriendsCount = payload
  }

  @Mutation
  SET_ADDED_FROM_KU(payload: number) {
    this._addedFromKu = payload
  }

  /*Статистика*/

  get menCount() {
    return this._menCount
  }

  get womenCount() {
    return this._womenCount
  }

  get genderNotSpecifiedCount() {
    return this._genderNotSpecifiedCount
  }

  get maxAge() {
    return this._maxAge
  }

  get minAge() {
    return this._minAge
  }

  get zodiacSignsPercent() {
    return this._zodiacSignsPercent
  }

  get averageAge() {
    return this._averageAge
  }

  @Mutation
  SET_MEN_COUNT(val) {
    this._menCount = val
  }

  @Mutation
  SET_WOMEN_COUNT(val) {
    this._womenCount = val
  }

  @Mutation
  SET_Gender_Not_Specified_Count(val) {
    this._genderNotSpecifiedCount = val
  }

  @Mutation
  SET_MAX_AGE(val) {
    this._maxAge = val
  }

  @Mutation
  SET_MIN_AGE(val) {
    this._minAge = val
  }

  @Mutation
  SET_AVERAGE_AGE(val) {
    this._averageAge = val
  }

  @Mutation
  SET_ZODIAC_SIGNS_PERCENT(val) {
    try {
      const resultArray = []
      const allCount = val['All']
      if (allCount > 0) {
        for (let [key, value] of Object.entries(val)) {
          if (key !== 'All') {
            // console.log(`${key}: ${value}`);
            //@ts-ignore
            const percent = roundDecimals((value / allCount) * 100, 1)
            resultArray.push({sign: key, percent})
          }
        }

        this._zodiacSignsPercent = resultArray
      }
    } catch (e) {
      if (AppModule.showLogs) console.error(e)
    }
  }

  @Action({rawError: true})
  public parseStatistics(payload: Array<{
    sex: number;
    age: number;
    zodiac: string;
    country: any;
  }>): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      let menCount = 0, womenCount = 0, genderNotSpecifiedCount = 0
      let minAge = 200, maxAge = 0, averageAge = 0, averageAgeCount = 0
      try {
        for (const item of payload) {
          const {sex, age, zodiac, country} = item
          if (sex == 1) {
            womenCount++
          } else if (sex == 2) {
            menCount++
          } else {
            genderNotSpecifiedCount++
          }
          if (age > 0) {
            maxAge = age > maxAge ? age : maxAge
            minAge = age < minAge ? age : minAge
            averageAgeCount++
            averageAge = averageAge + age
          }
          if (zodiac) {
            zodiacSignsCounter[zodiac]++
            zodiacSignsCounter['All']++
          }
        }
        this.context.commit('SET_MEN_COUNT', menCount)
        this.context.commit('SET_WOMEN_COUNT', womenCount)
        this.context.commit('SET_Gender_Not_Specified_Count', genderNotSpecifiedCount)
        this.context.commit('SET_MIN_AGE', minAge)
        this.context.commit('SET_MAX_AGE', maxAge)
        if (averageAgeCount > 0) {
          const averageAgeTrue = Math.round(averageAge / averageAgeCount)
          this.context.commit('SET_AVERAGE_AGE', averageAgeTrue)
        }

        // console.log('zodiacSignsCounter',zodiacSignsCounter)
        this.context.commit('SET_ZODIAC_SIGNS_PERCENT', zodiacSignsCounter)
      } catch (e) {
        result.error = e
      }

      resolve(result);
    });
  }

}

export const VkModule = getModule(Vk, store);



