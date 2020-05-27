import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { WebsocketModule } from "@/store/modules/websocket";
import { IErrorData } from "@/models/Interfaces";

export interface IMatchState {
}

const name = "match";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Match extends VuexModule implements IMatchState {

  _matchMembers = [];
  _matchMembersFlat = [];
  _overlapMembers = [];
  _overlapMembersFlat = [];
  _matchToken = "";
  _overlapToken = "";

//список с сервера "как есть"
  get matchMembers() {
    return this._matchMembers;
  }

//плоский список после анализа profile_h, profile_r, profile_n
  get matchMembersFlat() {
    return this._matchMembersFlat;
  }

//список с сервера "как есть"
  get overlapMembers() {
    return this._overlapMembers;
  }

//плоский список после анализа profile_h, profile_r, profile_n
  get overlapMembersFlat() {
    return this._overlapMembersFlat;
  }

  get matchToken() {
    return this._matchToken;
  }

  get overlapToken() {
    return this._overlapToken;
  }

  @Mutation
  SET_MATCH_TOKEN(payload) {
    // localStorage.setItem('matchToken', payload)
    this._matchToken = payload;
  }

  @Mutation
  SET_OVERLAP_TOKEN(payload) {
    // localStorage.setItem('overlapToken', payload)
    this._overlapToken = payload;
  }

  @Mutation
  SET_MATCH_MEMBERS(payload) {
    //список с сервера "как есть"
    this._matchMembers = payload;
    //плоский список после анализа profile_h, profile_r, profile_n
    const resultArray = [];
    for (const item of payload) {
      const {user_token, profile} = item;
      const {first_name, last_name, nickname, photo_1, photo_2, profile_h, profile_r, profile_n} = profile;
      let photo = photo_1 ? photo_1 : photo_2;
      if (profile_r && profile_r.photo) photo = profile_r.photo;
      if (profile_h && profile_h.photo) photo = profile_h.photo;
      if (profile_n && profile_n.photo) photo = profile_n.photo;

      resultArray.push({
        user_token,
        photo,
        first_name,
        last_name,
        nickname
      });
    }
    this._matchMembersFlat = resultArray;
  }

  @Mutation
  SET_OVERLAP_MEMBERS(payload) {
    //список с сервера "как есть"
    this._overlapMembers = payload;
    //плоский список после анализа profile_h, profile_r, profile_n
    const resultArray = [];
    for (const item of payload) {
      const {user_token, profile} = item;
      const {first_name, last_name, nickname, photo_1, photo_2, profile_h, profile_r, profile_n} = profile;
      let photo = photo_1 ? photo_1 : photo_2;
      if (profile_r && profile_r.photo) photo = profile_r.photo;
      if (profile_h && profile_h.photo) photo = profile_h.photo;
      if (profile_n && profile_n.photo) photo = profile_n.photo;

      resultArray.push({
        user_token,
        photo,
        first_name,
        last_name,
        nickname
      });
    }
    this._overlapMembersFlat = resultArray;
  }

  @Action({rawError: true})
  public getMatchMembers(payload): Promise<IErrorData> {
    const result = {error: null, data: null};
    return new Promise(async (resolve) => {
      try {
        const {match_token, includeCurrentUser, commitMembers = false} = payload;
        const include_cur_user = includeCurrentUser !== undefined ? includeCurrentUser : true;
        const params = {match_token, include_cur_user};
        const {error, data} = await WebsocketModule.callServer({"method": "quest.get_match_members", params});
        if (error) return resolve({error, data});
        result.data = data;
        const {users} = data;
        if (commitMembers && Array.isArray(users) && users.length > 0) {
          this.context.commit("SET_MATCH_MEMBERS", users);
        }
      } catch (error) {
        result.error = error;
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public getOverlapMembers(payload): Promise<IErrorData> {
    const result = {error: null, data: null};
    return new Promise(async (resolve) => {
      try {
        const {overlap_token, includeCurrentUser, commitMembers = false} = payload;
        const include_cur_user = includeCurrentUser !== undefined ? includeCurrentUser : true;
        const params = {overlap_token, include_cur_user};
        const {error, data} = await WebsocketModule.callServer({"method": "quest.get_match_members", params});
        if (error) return resolve({error, data});
        result.data = data;
        const {users} = data;
        if (commitMembers && Array.isArray(users) && users.length > 0) {
          this.context.commit("SET_OVERLAP_MEMBERS", users);
          /*            if (match_token) {
                        this.context.commit('SET_MATCH_MEMBERS', users)
                      } else if (overlap_token) {
                        console.log('если эта ветка сработает, проверить код')
                        // this.context.commit('SET_OVERLAP_MEMBERS', users)
                      }*/
        }
      } catch (error) {
        result.error = error;
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public getDayMatches(params = {}): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({"method": "quest.get_day_matches", params});
      resolve({error, data});
    });
  }

  @Action({rawError: true})
  public getDayOverlaps(params = {}): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({"method": "quest.get_day_overlaps", params});
      resolve({error, data});
    });
  }
}

export const MatchModule = getModule(Match);
