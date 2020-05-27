import Vue from 'vue';
import Vuex from 'vuex';
import {IAppState} from './modules/app';
import {IVkState} from './modules/vk';
import {IUserState} from './modules/user';
import {IAlertsState} from './modules/alerts';
import {IWebsocketState} from './modules/websocket';
import {ISetsState} from './modules/sets';
import {IMatchState} from './modules/match';
import {IFavoritesState} from './modules/favorites';

Vue.use(Vuex);

export interface IRootState {
  app: IAppState
  vk: IVkState
  user: IUserState
  alerts: IAlertsState
  websocket: IWebsocketState
  sets: ISetsState
  match: IMatchState
  favorites:IFavoritesState
}

// Declare empty store first, dynamically register all modules later.
export default new Vuex.Store<IRootState>({});


