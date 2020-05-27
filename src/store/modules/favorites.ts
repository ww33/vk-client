import { Action, getModule, Module, Mutation, VuexModule } from "vuex-module-decorators";
import store from "@/store";
import { WebsocketModule } from "@/store/modules/websocket";
import { getDayAsString } from "@/lib/utils";
import { Vue, VueConstructor } from "vue/types/vue";
import { is } from "@babel/types";

export interface IFavoritesState {
}

const name = "favorites";
if (store.state[name]) {
  store.unregisterModule(name);
}

@Module({dynamic: true, store, name})
class Favorites extends VuexModule implements IFavoritesState {
  _candidates = [];
  _candidatesRomantic = [];
  _eventsCount = 0;
  _requestsCount = 0;
  _favorites = [];

  get eventsCount() {
    return this._eventsCount;
  }

  get requestsCount() {
    return this._requestsCount;
  }

  get candidates() {
    return this._candidates.filter(item => item.user_token !== "");
  }

  get candidatesRomantic() {
    return this._candidatesRomantic.filter(item => item.user_token !== "");
  }

  get favorites() {
    return this._favorites;
  }

  @Mutation
  SET_EVENTS_COUNT(payload) {
    this._eventsCount = payload;
  }

  @Mutation
  SET_REQUESTS_COUNT(payload) {
    this._requestsCount = payload;
  }

  @Mutation
  SET_CANDIDATES(payload) {
    this._candidates = payload;
  }

  @Mutation
  SET_CANDIDATES_ROMANTIC(payload) {
    this._candidatesRomantic = payload;
  }

  @Mutation
  SET_FAVORITES(payload) {
    this._favorites = payload;
  }

  @Action({rawError: true})
  public getCandidates(): any {
    return new Promise(async (resolve) => {
      try {
        const {data, error} = await this.getCandidatesAndOverlaps({});
        if (error) {
          resolve({error});
        } else {
          this.SET_REQUESTS_COUNT(0);
          const today = getDayAsString(0);
          const yesterday = getDayAsString(-1);
          const romanticArray = [];
          const allArray = [];
          if (data.candidates && Array.isArray(data.candidates)) {
            for (const user of data.candidates) {
              const {user_token, section, section_letter, ttl_status, my_request, profile} = user;
              const setDate = ttl_status === "first_day" ? today : yesterday;
              const sectionProfile = profile["profile_" + section_letter];
              const photo = sectionProfile && sectionProfile.photo !== "" ? sectionProfile.photo : profile.photo_1;

              const iChose = my_request;
              const meChose = !my_request;

              const array = section === 2 ? romanticArray : allArray;

              if (meChose) {
                this.SET_REQUESTS_COUNT(this._requestsCount + 1);
              }

              array.push({
                profile,
                user_token,
                setDate,
                photo,
                iChose,
                meChose,
                section,
                is_overlap: false
              });
            }
          }

          if (data.overlaps && Array.isArray(data.overlaps)) {
            for (const day of data.overlaps) {
              const ttl_status = day.ttl_status;
              for (const item of day.sections) {
                const {section, overlap_users} = item;
                const array = section === 2 ? romanticArray : allArray;
                for (const user of overlap_users) {
                  const {user_token, profile, is_overlap} = user;
                  const setDate = ttl_status === "first_day" ? today : yesterday;
                  const sectionLetter = section === 1 ? "h" : section === 2 ? "r" : section === 3 ? "n" : null;
                  const sectionProfile = profile["profile_" + sectionLetter];
                  const photo = sectionProfile && sectionProfile.photo !== "" ? sectionProfile.photo : profile.photo_1;
                  const iChose = false;
                  const meChose = false;

                  array.push({
                    profile,
                    user_token,
                    setDate,
                    photo,
                    iChose,
                    meChose,
                    section,
                    is_overlap
                  });
                }
              }
            }
          }

          if (romanticArray.length > 0) {
            this.context.commit("SET_CANDIDATES_ROMANTIC", romanticArray);
          }
          if (allArray.length > 0) {
            this.context.commit("SET_CANDIDATES", allArray);
          }
          this.context.commit("SET_EVENTS_COUNT", romanticArray.length + allArray.length);
        }
      }catch (e) {
        resolve({error: e});
      }
    });
  }

  @Action({rawError: true})
  public getCandidatesAndOverlaps(params): any {
    return new Promise(async (resolve) => {
      const result = {error: null, data: null};
      try {
        const {error, data} = await WebsocketModule.callServer({"method": "user.get_candidates_and_overlaps", params});
        if (error) return resolve({error});
        result.data = data;
      } catch (error) {
        result.error = error;
      }
      resolve(result);
    });
  }

  @Action({rawError: true})
  public addCandidate(params): any {
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({"method": "user.chosen_add_candidate", params});
      if (error) {
        resolve({error});
      } else {
        resolve({data});
      }
    });
  }

  @Action({rawError: true})
  public getConfirmed(): any {
    return new Promise(async (resolve) => {
      try {
        const {error, data} = await WebsocketModule.callServer({"method": "user.chosen_get_confirmed"});
        if (error) {
          resolve({error});
        } else {
          const users = [];
          const usersMap = {};
          for (const user of data.users) {
            const {user_token, profile, sections} = user;
            const {photo_1, nickname, first_name, last_name} = profile;
            const sectionProfile = profile["profile_" + sections];
            const photo = sectionProfile && sectionProfile.photo ? sectionProfile.photo : photo_1;

            if (usersMap[user_token]) {
              setStatus(usersMap[user_token].status, sections);
            } else {
              const newUser = {
                user_token,
                first_name: first_name ? first_name : nickname,
                last_name,
                nickname,
                photo,
                status: [false, false, false],
                sections
              };
              setStatus(newUser.status, sections);
              usersMap[user_token] = newUser;
              users.push(newUser);
            }
          }

          this.context.commit("SET_FAVORITES", users);

          resolve({data});
        }
      }catch (e) {
        resolve({error:e});
      }
    });

    function setStatus(status, sections) {
      //“h” - Handshake, “r” - Romantic, “n” - Nonsense
      if (sections.indexOf("h") > -1) status[0] = true;
      if (sections.indexOf("r") > -1) status[1] = true;
      if (sections.indexOf("n") > -1) status[2] = true;
    }

  }

  @Action({rawError: true})
  public confirmUser(params): any {
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({"method": "user.chosen_confirm_user", params});
      if (error) {
        console.error("confirmUser", error);
        resolve({error});
      } else {
        console.log("confirmUser", data);
        resolve({data});
      }
    });
  }

  @Action({rawError: true})
  public chosenDeleteUser(userToken: string): any {
    return new Promise(async (resolve) => {
      const {error, data} = await WebsocketModule.callServer({
        "method": "user.chosen_delete_user",
        params: {user_token: userToken}
      });
      if (error) {
        console.error("chosenDeleteUser", error);
        resolve({error});
      } else {
        console.log("chosenDeleteUser", data);
        resolve({data});
      }
    });
  }

  @Action({rawError: true})
  removeCandidate(payload) {
    const {user_token, vue} = payload;
    const user = this._candidates.find(item => {
      return item.user_token === user_token;
    });
    if (user) {
      const id = this._candidates.indexOf(user);
      if (id) {
        vue.$delete(this._candidates, id);
        this.SET_EVENTS_COUNT(this._eventsCount - 1);
      }
    }
  }
}

export const FavoritesModule = getModule(Favorites);
