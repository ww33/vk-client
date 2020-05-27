import Vue from "vue";
import { VKMiniAppAPI } from "@vkontakte/vk-mini-apps-api";
import bridgeMock from "@vkontakte/vk-bridge-mock";
import axios from "axios";
import dayjs from "dayjs";

import { mockHistory } from "@/models/Constants";
import { VkModule } from "@/store/modules/vk";
import { UserModule } from "@/store/modules/user";
import { AppModule } from "@/store/modules/app";
import { WebsocketModule } from "@/store/modules/websocket";
import { MatchModule } from "@/store/modules/match";
import { FavoritesModule } from "@/store/modules/favorites";

import { IErrorData } from "@/models/Interfaces";
import {
  getDayAsString,
  getAgeAndZodiac
} from "@/lib/utils";

interface IAxiosParams {
  method: string;
  method_params: any;
}

export default new class {
  vkApi = inFrame() ? new VKMiniAppAPI() : new VKMiniAppAPI(bridgeMock);
  vkParams = {
    vk_app_id: null,
    vk_user_id: null,
    vk_access_token_settings: "",
    vk_are_notifications_enabled: "0",
    vk_is_app_user: "1",
    vk_is_favorite: "0",
    vk_language: "",
    vk_platform: "",
    vk_ref: "",
    access_token:''
  };
  vkSign;
  accessToken;

  vkParamsWithSign() {
    return {...this.vkParams, sign: this.vkSign};
  }

  async init(payload) {
    // console.log('vkService init')
    this.vkApi.initApp();
    let {vkParams, vkSign} = payload;
    if (vkSign === undefined) {
      if (AppModule.isDevelopment) {
        try {
          vkSign = localStorage.getItem("vk_sign");
          vkParams = JSON.parse(localStorage.getItem("vk_params"));
        } catch (e) {
          //
        }
      }
    } else {
      if (AppModule.isDevelopment) {
        try {
          localStorage.setItem("vk_sign", vkSign);
          localStorage.setItem("vk_params", JSON.stringify(vkParams));
        } catch (e) {
          //
        }
      }
    }

    this.vkParams = vkParams;
    this.vkSign = vkSign;
    if (vkParams.vk_app_id && vkParams.vk_user_id) {
      const key = "user_" + vkParams.vk_app_id + "_" + vkParams.vk_user_id;
      UserModule.READ_CURRENT_USER(key);
    }
    const {error, data} = await this.friendsSync();
    if (!WebsocketModule.isAuth && AppModule.isDevelopment) {
      const vm = new Vue();
      try {
        vm.$connect();
        console.log("vm.$connect()");
      } catch (e) {
        console.error(e.message);
      }
    }

    const {error: eHistory, data: dHistory} = await this.getHistory();
    if(AppModule.showLogs) console.error('getHistory', eHistory)
    // console.log('{error:eHistory, data:dHistory}',{error:eHistory, data:dHistory})
  }

  getVkParams() {
    return this.vkParams;
  }

  vkAppIdInt() {
    return this.vkParams && this.vkParams.vk_app_id ? parseInt(this.vkParams.vk_app_id) : null;
  }

  vkUserIdInt() {
    return parseInt(this.vkParams.vk_user_id);
  }

  /*параметры для вызова сервера по websocket*/
  paramsUserRegister() {
    return new Promise(async (resolve) => {
      const userInfo = await this.vkUserInfo();
      const obj = {
        method: "auth.register_vk_bridge_user",
        params: {
          vk_params: this.vkParams,
          vk_sign: this.vkSign,
          viewer_id: userInfo.id,
          profile: {
            profile_h: {
              photo: "",
              description: ""
            },
            profile_r: {
              photo: "",
              description: "",
              sex: 2,
              year: 0,
              min_age: 18,
              max_age: 80,
              pref_sex: 0,
              age_filter: [18, 80]
            },
            profile_n: {
              photo: "",
              description: ""
            },
            nickname: null,
            first_name: userInfo.first_name,
            last_name: userInfo.last_name,
            bdate: null,
            city: userInfo.city,
            country: userInfo.country,
            sex: userInfo.sex,
            photo_1: null,
            photo_2: null,
            photo_3: null,
            photo_4: null
          },
          vk_profile: {
            vk_platform: this.vkParams.vk_platform
          }
        }
      };
      //console.log(JSON.stringify(obj));
      resolve(obj);
    });
  }

  paramsUserAuth() {
    return new Promise((resolve) => {
      const obj = {
        method: "auth.auth_vk_bridge_user",
        params: {
          vk_params: this.vkParams,
          vk_sign: this.vkSign
        }
      };
      resolve(obj);
    });
  }

  async getAccessToken(scope = this.vkParams.vk_access_token_settings || this.vkParams.access_token) {
    if (this.accessToken) {
      console.log('this.accessToken', this.accessToken)
      return {access_token: this.accessToken};
    }else if(this.vkParams.access_token){
      console.log('this.vkParams.access_token', this.vkParams.access_token)
      return {access_token: this.vkParams.access_token}
    } else {
      try {
        const token = await this.vkApi.getAccessToken(this.vkAppIdInt(), scope);
        console.log('token', token)
        this.accessToken = token.accessToken;
        return {access_token: this.accessToken};
      } catch (e) {
        console.error('getAccessToken', e)
        return {error: e};
      }
    }
  }

  async vkUserInfo() {
    const userInfo = await this.vkApi.getUserInfo();
    console.log("VK userInfo", userInfo);
    return userInfo;
  }

  axiosConfig() {
    return {
      headers: {
        "Content-Type": "application/json"
      }
    };
  }

  setMarker() {
    return new Promise(async (resolve, reject) => {
      const params: IAxiosParams = {method: "vkont_historyview/set_friends_history_marker", method_params: null};
      const {error, data} = await this.postAxios(params);
      console.log("setMarker", {error, data});
      resolve({error, data});
    });
  }

  async friendsGet(): Promise<IErrorData> {
    return new Promise(async (resolve, reject) => {
      const result = {error: null, data: null};
      const {error, access_token} = await this.getAccessToken();
      console.log("getAccessToken after",{error, access_token})
      if (!error) {
        const params = {
          app_id: this.vkAppIdInt(),
          access_token,
          fields: "bdate,nickname,sex,status, country,timezone, photo_50,online ",
          /*Доступные значения: nickname, domain, sex, bdate, city, country, timezone, photo_50, photo_100, photo_200_orig, has_mobile, contacts, education, online, relation, last_seen, status, can_write_private_message, can_see_all_posts, can_post, universities*/
          v: "5.100"
        };

        this.vkApi
            .callAPIMethod("friends.get", params)
            .then((data) => {
              result.data = data;
              resolve(result);
            })
            .catch((e) => {
              result.error = e;
              resolve(result);
            });
      } else {
        result.error = error;
        resolve(result);
      }
    });
  }

  async postAxios(params: IAxiosParams): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {method, method_params} = params;

      const axiosConfig = {
        headers: {
          "Content-Type": "application/json"
        }
      };
      console.log('this.vkParamsWithSign', this.vkParamsWithSign())
      const paramsAxios = {
        jsonrpc: "2.0",
        id: 1,
        method,
        params: {
          vk_access_token_settings: this.vkParamsWithSign(),
          method_params
        }
      };

      try {
        // const response = await axios.post("https://api.test.myqu.inachi.eu/api.php", paramsAxios, axiosConfig);
        const response = await axios.post("https://api.myqu.inachi.eu/api.php", paramsAxios, axiosConfig);
        result.data = response.data;

      } catch (e) {
        if(AppModule.showLogs) console.error(params, e)
        result.error = e.response || e;
      }
      return resolve(result);
    });
  }

  async friendsSync(): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const result = {error: null, data: false};
      try {
        let items;

        const apiResult = this.vkParams['api_result'];
        if (apiResult) {
          const result = JSON.parse(apiResult);
          items = result.response.freands.items;
        } else {
          let {error, data} = await this.friendsGet();
          console.log("friendsSync", error, data);
          if (error) return resolve({error, data: null});

          items = data.items;
          console.log("new api friends", items);

          if (!items || items.length === 0) {
            console.warn('friends array is empty')
            return resolve(result)
          }
        }

        if (items === undefined) {
          console.log("items empty");
          return;
        }
        //идем дальше только если массив id друзей наполнен

        console.log("items", items);

        VkModule.SET_FRIENDS(items);
        // console.log('VkModule.friendsIdArray', VkModule.friendsIdArray)

        console.log("FIA", VkModule.friendsIdArray);

        //синхронизация
        const method_params = {friends: VkModule.friendsIdArray};
        console.log(method_params);

        const paramsSync = {method: "vkont_historyview/sync_friends", method_params: method_params};
        const {error: eSync, data: dataSync} = await this.postAxios(paramsSync);
        if (eSync) {
          result.error = eSync;
        } else {
          result.data = dataSync;
          if (dataSync.new) VkModule.SET_ADDED_FRIENDS_COUNT(dataSync.new);
          if (dataSync.rem) VkModule.SET_REMOVED_FRIENDS_COUNT(dataSync.rem);
        }
      }catch (e) {
        result.error = e
      }
      return resolve(result);
    });
  }

  async getHistory(params = {}): Promise<IErrorData> {
    return new Promise(async (resolve) => {
      const statisticsArray = [];
      const result = {error: null, data: []};
      try {
        let dataHistory;
        const defaultParams = {
          page: 0,
          filtred_new: false,
          filtred_rem: false,
          items_page_limit: 50,
          date_filter: false
        };
        const method_params = {...defaultParams, ...params};
        // console.log('getHistory params', methodParams)
        const paramsHistory: IAxiosParams = {method: "vkont_historyview/get_friends_history", method_params};
        const {error, data} = await this.postAxios(paramsHistory);
        if (error) {
          console.log("Using mockHistory because error", error);
          dataHistory = mockHistory;//если не удалось получить реальную историю - используем заглушку
        } else {
          dataHistory = data;
        }

        const lookup = {};
        let user_ids = "";
        for (const item of dataHistory) {
          user_ids = user_ids + item.user_id + ",";
        }

        if (user_ids === "") {
          if (AppModule.showLogs) console.log("список друзей пуст");
          result.data = [];
          return resolve(result);
        }

        const fields = "photo_50, last_seen, online, bdate, sex, city, country, timezone";// из VK выцепляем фото для history
        // по id
        /*Доступные значения: nickname, domain, sex, bdate, city, country, timezone, photo_50, photo_100, photo_200_orig, has_mobile, contacts, education, online, relation, last_seen, status, can_write_private_message, can_see_all_posts, can_post, universities*/

        const vkUsers = await this.usersGet({user_ids, fields});
        if (Array.isArray(vkUsers)) {
          for (let i = 0, len = vkUsers.length; i < len; i++) {
            lookup[vkUsers[i].id] = vkUsers[i];
          }
        } else {
          result.error = "vkUsers not array";
          return resolve(result);
        }

        for (const item of dataHistory) {
          try {
            const user = lookup[item.user_id];
            if (user) {
              item.photo = user.photo_50;
              item.first_name = user.first_name;
              item.last_name = user.last_name;
              if (user.last_seen && user.last_seen.time) {
                item.last_seen = dayjs(user.last_seen.time * 1000).format("YYYY-MM-DD hh:mm");
              }

              item.bdate = user.bdate;
              const {error, age, zodiac} = getAgeAndZodiac(user.bdate);
              if (!error) {
                item.age = age;
                item.zodiac = zodiac;
              }
              const sex = user.sex;
              item.sex = sex;
              const country = user.country;
              item.country = country;

              statisticsArray.push({sex, age, zodiac, country});
            }
          } catch (e) {
            if (AppModule.showLogs) console.error(e);
          }
        }
        VkModule.SET_HISTORY(dataHistory);
        setTimeout(() => {
          VkModule.parseStatistics(statisticsArray).then();
        }, 1);
        result.data = dataHistory;
        console.log('dataHistory', dataHistory)
      } catch (e) {
        result.error = e;
      }
      return resolve(result);
    });
  }

  usersGet(params) {
    return new Promise(async (resolve, reject) => {
      const {error, access_token: accessToken} = await this.getAccessToken();
      if (error) return reject(error);

      const allParams = {...params, access_token: accessToken, v: "5.100"};
      this.vkApi
          .callAPIMethod("users.get", allParams)
          .then((result) => resolve(result))
          .catch((e) => reject(e));
    });
  }

  getVideoServer(spaceId: string) : Promise<any> {
    return new Promise(async (resolve, reject) => {
      const method_params = {
        "space_id": spaceId,
        "domain": "meetup.inachi.eu"
      };
      const params: IAxiosParams = {method: "vkont_servers_api/get_video_server", method_params};
      const {error, data} = await this.postAxios(params);
      if (error) {
        console.log("Error get server", error);
        reject(error);
      } else {
        resolve(data);
      }
    });
  }
};

function inFrame() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
