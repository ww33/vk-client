import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";

export interface IAlertsState {
}

export interface IInvite {
  status: number;
  photo?: any;
  who?: any;
  callback1?: any;
  callback2?: any;
  threadToken?: string;
  vRoomId?: string;
}

const name = "alerts";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Alerts extends VuexModule implements IAlertsState {
  _error = "";
  _message = "";
  testInvite: IInvite = {who: "Маша", status: 1};
  testInvite2: IInvite = {who: "Маша", status: 2};
  testInvite3: IInvite = {who: "Маша", status: 3};

  _invites: Array<IInvite> = [];

  get error() {
    return this._error;
  }

  get message() {
    return this._message;
  }

  get invitesAll() {
    return this._invites;
  }

  get invite() {
    if (this._invites.length > 0) return this._invites[0];
  }

  @Mutation SET_ERROR(val: string) {
    this._error = val;
  }

  @Mutation CLEAR_ERROR() {
    this._error = "";
  }

  @Mutation SET_MESSAGE(val: string) {
    this._message = val;
  }

  @Mutation CLEAR_MESSAGE() {
    this._message = "";
  }

  @Mutation SET_INVITES(val) {
    this._invites = val;
  }

  @Mutation INSERT_INVITE_FIRST(val) {
    this._invites.unshift(val);
  }

  @Mutation INSERT_INVITE_LAST(val) {
    this._invites.push(val);
  }

  @Mutation DELETE_CURRENT_INVITE() {
    if (this._invites.length > 0) {
      this._invites.shift();
    }
  }

  @Action({rawError: true})
  public testInvites() {
    this.context.commit("SET_INVITES", []);
    setTimeout(() => {
      this.context.commit("SET_INVITES", [this.testInvite, this.testInvite2, this.testInvite3]);
    }, 500);
  }
}

export const AlertsModule = getModule(Alerts);
