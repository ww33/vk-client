import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { AppModule } from "./app";
import { MatchModule } from "./match";
import { FavoritesModule } from "@/store/modules/favorites";
import vkService from "@/services/vkService";
import { getDayAsString, getPrintableName } from "@/lib/utils";
import { IErrorData } from "@/models/Interfaces";
import { UserModule } from "@/store/modules/user";
import { IInvite } from "@/store/modules/alerts";

let WebSocket = null;
const requests = {};
let id = 0;

export interface IWebsocketState {
}

const name = "websocket";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Websocket extends VuexModule implements IWebsocketState {
  _isConnected = false;
  _isAuth = false;
  _isUserRegistered = false;
  notifications = [];
  _messageEmitter = null;

  get isConnected() {
    return this._isConnected;
  }

  get isAuth() {
    return this._isAuth;
  }

  get userRegistered() {
    return this._isUserRegistered || localStorage.getItem("userRegistered");
  }

  @Mutation
  SET_IS_CONNECTED(val: boolean) {
    if (val === false) console.log("SET_IS_CONNECTED", val);
    this._isConnected = val;
  }

  @Mutation
  SET_IS_AUTH(val: boolean) {
    if (val === false) console.log("SET_IS_AUTH", val);
    this._isAuth = val;
  }

  @Mutation
  SET_USER_REGISTERED(val: boolean) {
    this._isUserRegistered = val;
    if (val) {
      localStorage.setItem("userRegistered", "1");
    } else {
      localStorage.removeItem("userRegistered");
    }
  }

  @Action({rawError: true})
  Init(payload) {
    const {eventListener} = payload;

    eventListener.onopen = (data) => {
      //if (AppModule.showLogs)console.log('ws onopen');
      this.context.commit("SET_IS_CONNECTED", true);
      WebSocket = data.target;
      this.auth();
    };

    eventListener.onclose = (data) => {
      if (AppModule.showLogs) console.log("ws onclose");
      this.context.commit("SET_IS_CONNECTED", false);
      this.context.commit("SET_IS_AUTH", false);
    };

    eventListener.onmessage = (message) => {
      const data = message.data;
      // const data = message.data;
      let response = undefined;
      if (typeof data === "object") {
        response = data;
      } else if (typeof data === "string" && data.charAt(0) === "{") {
        try {
          response = JSON.parse(data);
        } catch (e) {
          if (AppModule.showLogs) console.error(e);
          return false;
        }
      } else {
        if (AppModule.showLogs) console.log(data);
        return false;
      }

      if (response.hasOwnProperty("id")) {
        this.onServerResponseById(response);
      } else {
        this.onServerNotification(response);
      }
    };

    eventListener.onerror = (error) => {
      if (AppModule.showLogs) console.log("ws onerror", error);
    };

    eventListener.reconnectError = (error) => {
      if (AppModule.showLogs) console.log("ws reconnectError ", error);
      this.context.commit("SET_IS_CONNECTED", false);
      this.context.commit("SET_IS_AUTH", false);
    };

  }

  @Action({rawError: true})
  auth() {
    return new Promise(async (resolve, reject) => {
      const paramsForAuth = await vkService.paramsUserAuth();//TODO нет обработки ошибки
      console.log(JSON.stringify(paramsForAuth));
      const {data, error} = await this.callServer(paramsForAuth);
      console.log("auth data", data, error);

      if (error || data === false) {
        this.context.commit("SET_IS_AUTH", false);
        if (AppModule.showLogs) console.error("auth error", data, error);
      } else {
        this.context.commit("SET_IS_AUTH", true);
        this.context.commit("SET_USER_REGISTERED", true);
        await this.loadInitialData();// первичное заполнение данными, как только сокет готов
      }
    });
  }

  @Action({rawError: true})
  register(paramsForRegister) {
    return new Promise(async (resolve, reject) => {
      if (AppModule.showLogs) console.log(paramsForRegister);
      const {error, data} = await this.callServer(paramsForRegister);
      if (error || data == false) {
        this.context.commit("SET_USER_REGISTERED", false);
        if (AppModule.showLogs) console.error("user register error", data, error);
        reject();
      } else {
        this.context.commit("SET_USER_REGISTERED", true);
        this.context.commit("SET_IS_AUTH", true);
        resolve();
      }
    });
  }

  @Action({rawError: true})
  async loadInitialData() {

    FavoritesModule.getCandidates().catch(e => console.error(e));
    FavoritesModule.getConfirmed().catch(e => console.error(e));
    UserModule.load().catch(e => console.error(e));
    /*    const {error, data} = await FavoritesModule.getCandidatesAndOverlaps({section: 2});
        console.log("getCandidatesAndOverlaps section: 2", {error, data});*/
    /*    const { error:errM, data:dataM } = await MatchModule.getDayMatches();
        console.log("getDayMatches", dataM);*/
    /*    const params = {day: getDayAsString(-1), section: 2};
        const {error: errorO, data: dataO} = await MatchModule.getDayOverlaps(params);
        console.log("getDayOverlaps", {errorO, dataO});*/
  }

  @Action({rawError: true})
  sendText(text) {
    if (this.isConnected && WebSocket) {
      WebSocket.send(text);
    }
  }

  @Action({rawError: true})
  sendObject(obj) {
    if (this.isConnected && WebSocket) {
      WebSocket.sendObj(obj);
    }
  }

  @Action({rawError: true})
  callServer(obj): Promise<IErrorData> {
    const {params} = obj;
    id = id + 1;
    obj["jsonrpc"] = "2.0";
    obj["id"] = id;
    return new Promise((resolve, reject) => {
      try {
        if (this.isConnected) {
          // console.log('obj', JSON.stringify(obj))
          WebSocket.sendObj(obj);
          requests[id] = {params, resolve, reject};
        } else {
          reject({"code": -1, "message": "WebSocket not auth"});
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  @Action({rawError: true})
  onServerResponseById(obj) {
    try {
      const {id, error, result: data} = obj;
      const request = requests[id];
      if (request) {
        // const result = {error, data};
        const {resolve} = request;
        try {
          delete requests[id];
        } catch (e) {
        }
        if (resolve) {
          if (error) {
            resolve({error, data});
          } else if (data !== undefined) {
            resolve({data});
          } else {
            resolve({error: "wrong response from server", data: obj});
          }
        }
      } else {
        console.error("onServerResponseById wrong id", obj);
      }
    } catch (e) {
      console.error("onServerResponseById ", e);
    }
  }

  @Action({rawError: true})
  onServerNotification(obj) {
    this.notifications.push(obj);
    setTimeout(() => {
      this.checkNotifications();
    }, 0);
  }

  @Mutation
  public setMessageEmitter(emitter: (message: any) => void) {
    this._messageEmitter = emitter;
  }

  get messageEmitter() {
    return this._messageEmitter;
  }

  @Action({rawError: true})
  checkNotifications() {
    try {
      for (const item of this.notifications) {
        const {method, params} = item;
        switch (method) {
          case "chat.notify_new_message":
            console.log("chat.notify_new_message", params);
            if (typeof this.messageEmitter == "function") {
              this.messageEmitter(item.params);
            }
            break;
          case "quest.notify_match_new_user":
            const ample =
              {
                "jsonrpc": "2.0", "method": "quest.notify_match_new_user",
                "params":
                  {
                    "day": "20-04-01",
                    "section": 2,
                    "set_num": 6,
                    "match_token": "20-04-01:2:6:123:1",
                    "user_token": "5O5}W=wwPuhI?B|bwaY0",
                    "profile": {
                      "first_name": "test fname4", "last_name": "test lname4"
                    }
                  }
              };
            console.log(method, params);
            break;
          case "quest.notify_overlap_new_user":
            const sample2 =
              {
                "jsonrpc": "2.0", "method": "quest.notify_overlap_new_user",
                "params":
                  {
                    "day": "20-04-01",
                    "section": 2,
                    "set_num": 6,
                    "overlap_token": "f:20-04-04:3:2:11111",
                    "user_token": "5O5}W=wwPuhI?B|bwaY0",
                    "profile": {
                      "first_name": "test fname4", "last_name": "test lname4"
                    }
                  }
              };
            console.log(method, params);
            break;
          case "chat.notify_video_invite":
            console.log("chat.notify_video_invite", params);
            const profile = params.profile;
            const photo = profile.photo_1;
            const invite: IInvite = {
              status: 2,
              photo: photo,
              who: getPrintableName(profile),
              callback1: () => {
                console.log("open chat");
              },
              callback2: () => {
                console.log("reject");
              },
              threadToken: params.thread_token,
              vRoomId: params.vroom_id
            };
            this.context.commit("SET_INVITES", [invite]);
            break;
          default:
            console.log(method, params);
        }
      }
    } catch (e) {
      console.error("checkNotifications", e);
    }
  }
}

export const WebsocketModule = getModule(Websocket);
