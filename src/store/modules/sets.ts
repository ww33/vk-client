import { Vue } from 'vue-property-decorator';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import store from '@/store';
import { WebsocketModule } from '@/store/modules/websocket';
import { AppModule } from '@/store/modules/app';
import { AlertsModule } from '@/store/modules/alerts';
import { MatchModule } from '@/store/modules/match';

export interface ISetsState {
}

const name = 'sets';
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Sets extends VuexModule implements ISetsState {
  _currentSection = 0
  _currentQuest = {1: undefined, 2: undefined, 3: undefined};
  _quest_num = {1: 0, 2: 0, 3: 0};//quest_num[section] - номер текущего вопроса в сете указанной секции
  _matchUp = 0

  get currentQuest() {
    return (section: number) => {
      return this._currentQuest[section];
    };
  }

  get questNum() {
    return (section: number) => {
      return this._quest_num[section];
    };
  }

  get currentSection() {
    return this._currentSection
  }

  get profileNameForCurrentSection() {
    if (this.currentSection === 1) {
      return 'profile_hs'
    } else if (this.currentSection === 2) {
      return 'profile_r'
    } else if (this.currentSection === 3) {
      return 'profile_n'
    }
  }

  get matchUp() {
    return this._matchUp
  }

  @Mutation
  SET_MATCH_UP(payload) {
    this._matchUp = payload
  }

  @Mutation
  SET_CURRENT_SECTION(payload) {
    this._currentSection = payload
  }

  @Mutation
  SET_CURRENT_QUEST(payload) {
    const {section, data} = payload;
    const {quest_num} = data;
    let questNum = quest_num
    if (data.hasOwnProperty('set_closed')) {
      questNum = 0
    } else {
      /*      if (quest.hasOwnProperty('answered')) {
              quest_num = quest.answered.length + 1;
            } else {
              quest_num = this._quest_num[section] + 1;
            }*/
    }
    Vue.set(this._quest_num, section, questNum);
    Vue.set(this._currentQuest, section, data);

  }

  @Action({rawError: true})
  public getCurrentSet(section: number): any {
    this.context.commit('SET_CURRENT_SECTION', section)
    // currentSection = section
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({'method': 'quest.get_current_set', 'params': {section}})
      if (error) {
        resolve({error})
      } else {
        if (!data.hasOwnProperty('day_closed')) {
          this.context.commit('SET_CURRENT_QUEST', {section, data});
        }
        resolve({data})
      }
    });
  }

  @Action({rawError: true})
  public registerAnswerAndGetNextQuest(params): any {
    return new Promise(async (resolve) => {
      const result = {error: null, data: {route: ''}}
      try {
        const section = this.currentSection
        params.quest_num = this._quest_num[section]
        const {error, data} = await WebsocketModule.callServer({method: 'quest.set_quest_answer', params})
        if (error) {
          result.error = error
        } else {
          this.context.commit('SET_CURRENT_QUEST', {section, data})
          const {match_token, overlap_token, match_up, set_num} = data
          this.context.commit('SET_MATCH_UP', match_up)

          if (data.hasOwnProperty('set_closed') || data.set_closed === true) {
            if (match_token || overlap_token) {
              if (match_token) {
                MatchModule.SET_MATCH_TOKEN(match_token)
              }
              if (overlap_token) {
                MatchModule.SET_OVERLAP_TOKEN(overlap_token)
              }
              console.log('set_quest_answer closed', {match_token, overlap_token})
              result.data.route = '/friends-found'

            } else {
              AlertsModule.SET_MESSAGE('Пока совпадений нет')
              result.data.route = '/start'
            }
          }
        }
      } catch (error) {
        result.error = error
      }
      if (result.error) {
        try {
          this.getCurrentSet(this.currentSection)
        } catch (e) {

        }
      }
      resolve(result)
    });
  }

  @Action({rawError: true})
  public ping(params = {}): any {
    return new Promise(async (resolve, reject) => {
      const {error, data} = await WebsocketModule.callServer({'method': 'ping', params});
      return error ? resolve({error}) : resolve({data})
    });
  }

}

export const SetsModule = getModule(Sets);


