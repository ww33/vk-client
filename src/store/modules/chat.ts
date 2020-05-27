import { VuexModule, Module, Action, getModule } from "vuex-module-decorators";
import store from "@/store";
import { AppModule } from "@/store/modules/app";
import { WebsocketModule } from "@/store/modules/websocket";

export interface IChatState {

}

const name = "chat";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Chat extends VuexModule implements IChatState {

  @Action({rawError: true})
  public getThreadToken(payload): any {
    const {matchToken, userToken} = payload;
    if (AppModule.showLogs) console.log("getThreadToken, MT, UT", matchToken, userToken);

    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {"method": "chat.get_thread_token", "params": {match_token: matchToken, user_token: userToken}}
      );
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
        console.log("thread token result", data);
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public getThreadUsers(threadToken): any {
    if (AppModule.showLogs) console.log("getThreadUsers", threadToken);

    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {"method": "chat.get_thread_users", "params": {thread_token: threadToken, include_cur_user: true}}
      );
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
        console.log("thread users result", data);
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public loadMessages(threadToken): any {
    if (AppModule.showLogs) console.log("loadMessages for thread", threadToken);

    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {
          "method": "chat.get_messages", "params": {
            thread_token: threadToken
          }
        }
      );
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public subscribeToMessages(emitter: (message: any) => void) {
    return new Promise(async (resolve) => {
      WebsocketModule.setMessageEmitter(emitter);
      resolve();
    });
  }

  @Action({rawError: true})
  public postMessage(payload): any {
    const {threadToken, text} = payload;
    if (AppModule.showLogs) console.log("postMessage", threadToken, text);

    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {
          "method": "chat.post_message", "params": {
            thread_token: threadToken,
            text: text
          }
        }
      );
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public invite(threadToken): any {
    if (AppModule.showLogs) console.log("invite", threadToken);

    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      const {error, data} = await WebsocketModule.callServer(
        {
          "method": "chat.video_invite_new", "params": {
            thread_token: threadToken
          }
        }
      );
      if (error) {
        result.error = error;
        console.error(error);
      } else {
        result.data = data;
      }
      resolve(result);
    });
  }
}

export const ChatModule = getModule(Chat);
