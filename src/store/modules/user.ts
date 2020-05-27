import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { AppModule } from "@/store/modules/app";
import { WebsocketModule } from "@/store/modules/websocket";

export interface IUserState {

}

const name = "user";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class User extends VuexModule implements IUserState {

  _currentUser = {
    nickname: "",
    first_name: "",
    last_name: "",
    photo_1: null,
    photo_2: null,
    photo_3: null,
    photo_4: null,
    bdate: "",
    sex: 0,
    profile_h: {
      description: "",
      photo: "",
    },
    profile_n: {
      description: "",
      photo: "",
    },
    profile_r: {
      description: "",
      photo: "",
      sex: 0,
      year: 0,
      min_age: 18,
      max_age: 80,
      pref_sex: 0,
      age_filter: [18, 20],
    },
  };

  currentUserKey;

  get currentUser() {
    return this._currentUser;
  }

  @Mutation
  SET_CURRENT_USER(payload) {
    this._currentUser = payload;
  }

  @Mutation
  SAVE_CURRENT_USER() {
    if (this.currentUserKey) {
      try {
        localStorage.setItem(this.currentUserKey, JSON.stringify(this._currentUser));
      } catch (e) {
        console.error(e);
      }
    }
  }

  @Mutation
  READ_CURRENT_USER(key) {
    try {
      this.currentUserKey = key;
      const tempStr = localStorage.getItem(key);
      if (tempStr) {
        const tempUser = JSON.parse(tempStr);
        if (tempUser) {
          this._currentUser = tempUser;
        }
      }
    } catch (e) {
      //
    }
  }

  @Action({rawError: true})
  public getProfile(): any {
    if (AppModule.showLogs) console.log("get my profile");
    return new Promise(async (resolve, reject) => {
      const result = {error: null, data: null};
      try {
        const {error, data} = await WebsocketModule.callServer({method: "user.get_user_profile"});
        if (error) {
          result.error = error;
        } else {
          result.data = data;
          if (result.data.profile_h === undefined) {
            result.data.profile_h = {
              description: "",
              photo: "",
            };
          }
          if (result.data.profile_n === undefined) {
            result.data.profile_n = {
              description: "",
              photo: "",
            };
          }
          if (result.data.profile_r === undefined) {
            result.data.profile_r = {
              description: "",
              photo: "",
              sex: 0,
              year: 0,
              pref_sex: 0,
              age_filter: [18, 20],
            };
          }
        }
        resolve(result);
      }catch (e) {
        result.error = e
        resolve(result);
      }

    });
  }

  @Action({rawError: true})
  public getUserProfile(userToken): any {
    if (AppModule.showLogs) console.log("get user profile", userToken);
    return new Promise(async (resolve, reject) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer({
        method: "user.chosen_get_user_profile",
        params: {
          user_token: userToken,
          confirmed: true
        }
      });
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
        console.log("user profile", data);
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public updateProfile(profile): any {
    if (AppModule.showLogs) console.log("updateProfile", profile);

    return new Promise(async (resolve, reject) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {"method": "user.update_user_profile", "params": {profile}},
      );
      if (error) {
        console.error(error);
        result.error = error;
      } else {
        console.log("profile updated", data);
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public setBan(payload): any {
    const {userToken, clearBan} = payload;
    if (AppModule.showLogs) console.log("set ban status", userToken, clearBan);

    return new Promise(async (resolve, reject) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {method: "user.set_banned_status", params: {banned_user: userToken, clear_ban: clearBan}},
      );
      if (error) {
        console.error(error);
        result.error = error;
      } else {
        console.log(data);
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  async load() {
    try {
      if (WebsocketModule._isAuth) {
        const result = await this.getProfile();
        if (!result.error && result.data) {
          const profile = result.data;
          this._currentUser.nickname = profile.nickname;
          this._currentUser.first_name = profile.first_name;
          this._currentUser.last_name = profile.last_name;
          this._currentUser.bdate = profile.bdate;
          this._currentUser.sex = profile.sex;
          this._currentUser.photo_1 = profile.photo_1;
          this._currentUser.photo_2 = profile.photo_2;
          this._currentUser.photo_3 = profile.photo_3;
          this._currentUser.photo_4 = profile.photo_4;
          this._currentUser.profile_h = profile.profile_h;
          this._currentUser.profile_n = profile.profile_n;
          this._currentUser.profile_r = profile.profile_r;
          this.SAVE_CURRENT_USER();
        }
      } else {
        console.warn("not auth");
      }
    }catch (e) {
      throw e
    }

  }

  @Action({rawError: true})
  async delete() {
    if (WebsocketModule._isAuth) {
      const {error, data} = await WebsocketModule.callServer(
        {method: "user._delete_cur_user"},
      );
      return console.log(error, data);
    }
  }

  @Action({rawError: true})
  async getAll() {
    if (WebsocketModule._isAuth) {
      const {error, data} = await WebsocketModule.callServer(
        {method: "user._get_all_user"},
      );
      return console.log(error, JSON.stringify(data));
    }
  }

}

export const UserModule = getModule(User);
