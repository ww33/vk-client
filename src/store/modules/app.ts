import {getModule, Module, Mutation, VuexModule} from 'vuex-module-decorators';
import store from '@/store';
import {detectIsMobile} from '@/lib/utils';

export interface IAppState {
}

const name = 'app';
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class App extends VuexModule implements IAppState {
  _isMobile = detectIsMobile();
  _showLogs = true
  _vk_sign = undefined

  get showLogs() {
    return this._showLogs
  }

  get isMobile() {
    return this._isMobile;
  }

  get isDevelopment() {
    return process.env.NODE_ENV !== 'production';
  }

  get vk_sign() {
    return this._vk_sign
  }

  @Mutation
  SET_VK_SIGN(payload) {
    this._vk_sign = payload
  }

}

export const AppModule = getModule(App);
