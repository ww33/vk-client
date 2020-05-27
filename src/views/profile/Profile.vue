<template>
  <v-container fluid class="main-content">
    <v-row no-gutters>
      <v-col cols="7">
        <span class="view-title">
          Создание профиля
        </span>
      </v-col>
      <v-col cols="5">
        <span class="page-subtitle">
          Профиль надо создать, чтобы Вы могли сами решать - с кем общаться, а с кем нет.
        </span>
      </v-col>
    </v-row>
    <v-row
      no-gutters
      class="subcontent">
      <v-col cols="3">
        <v-row no-gutters>
          <v-col cols="12">
            <a
              class="link-vk-import"
              @click.prevent="importVk">
              <v-img
                height="40"
                max-width="40"
                :src="require('../../assets/svg/vk46.svg')" />
              Импортировать
              <br />
              всё из ВК
            </a>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="9">
        <v-row no-gutters>
          <strong class="small-text">
            1. Придумайте никнейм для Приложения (будет виден всем)
          </strong>
        </v-row>

        <v-row no-gutters>
          <v-col cols="6">
            <v-text-field
              v-model="currentUser.nickname"
              label="Никнейм"
              placeholder="Никнейм"
              class="input-field nickname-field"
              rounded
              solo
              :rules="[rules.required, rules.min]"
            />
          </v-col>
        </v-row>

        <v-row no-gutters>
          <strong class="small-text">
            2. Ваше фото для Приложения (будет виден всем)
          </strong>
        </v-row>

        <v-row
          no-gutters
          style="margin-bottom: 20px">
          <template v-for="(item, index) in photos">
            <UserPhoto
              v-if="photos[index] != null || photos[index-1] != null || (photos[0] == null && index === 0)"
              :key="index"
              :src="item"
              :index="index"
              class="mx-1"
              @update="updatePhoto" />
          </template>
        </v-row>

        <v-row>
          <v-col cols="6">
            <strong class="small-text">
              3. Подтвердите дату рождения
              <br />
              (или исправьте)
            </strong>
          </v-col>
          <v-col cols="4">
            <v-dialog
              ref="dialog"
              v-model="modal"
              :return-value.sync="date"
              persistent
              width="300">
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="currentUser.bdate"
                  label=""
                  readonly
                  solo
                  rounded
                  dense
                  class="input-field data-field"
                  v-on="on" />
              </template>
              <v-date-picker
                v-model="currentUser.bdate"
                first-day-of-week="1"
                scrollable
                locale="ru">
                <v-spacer />
                <v-btn
                  text
                  color="primary"
                  @click="modal = false">
                  Отмена
                </v-btn>
                <v-btn
                  text
                  color="primary"
                  @click="$refs.dialog.save(currentUser.bdate)">
                  Ok
                </v-btn>
              </v-date-picker>
            </v-dialog>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col cols="2">
            <strong class="small-text sex">4. Ваш пол</strong>
          </v-col>
          <v-col cols="10">
            <v-btn-toggle
              v-model="currentUser.sex"
              group
              mandatory
              class="custom-toggle">
              <v-btn :value="2">
                М
              </v-btn>
              <v-btn :value="1">
                Ж
              </v-btn>
              <v-btn :value="0">
                Не буду указывать
              </v-btn>
            </v-btn-toggle>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          class="next-container">
          <v-spacer />
          <v-btn
            right
            rounded
            class="gradient-button"
            @click="onNext">
            Создать
          </v-btn>
          <!--
                    <v-btn
                      right
                      rounded
                      class="gradient-button"
                      @click="onDelete">
                      Удалить
                    </v-btn>
          -->
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { UserModule } from "@/store/modules/user";
  import vkService from "@/services/vkService";
  import UserPhoto from "@/views/profile/UserPhoto.vue";
  import { WebsocketModule } from "@/store/modules/websocket";

  @Component({
    components: {
      UserPhoto,
    },
  })
  export default class Profile extends Vue {
    modal = false;
    //nicknameWasEmpty = true;
    //firstCheck = true;

    rules = {
      required: (value) => !!value || "Хорошо бы заполнить",
      min: (v) => v && v.length >= 3 || "Минимальная длина - 3 символа",
    };

    created() {
      UserModule.load();
      UserModule.getAll();
    }

    updatePhoto(src, index) {
      switch (index) {
        case 0:
          this.currentUser.photo_1 = src;
          break;
        case 1:
          this.currentUser.photo_2 = src;
          break;
        case 2:
          this.currentUser.photo_3 = src;
          break;
        case 3:
          this.currentUser.photo_4 = src;
          break;
      }
    }

    get photos() {
      return [
        this.currentUser.photo_1,
        this.currentUser.photo_2,
        this.currentUser.photo_3,
        this.currentUser.photo_4,
      ];
    }

    async importVk() {
      const vkUserInfo = await vkService.vkUserInfo();
      const currentUser = UserModule.currentUser;
      currentUser.photo_1 = vkUserInfo.photo_100;
      if (vkUserInfo.bdate) {
        const date = vkUserInfo.bdate.split(".");
        currentUser.bdate = new Date(+date[2], +date[1] - 1, +date[0] + 1).toISOString().substr(0, 10);
      }
      currentUser.sex = vkUserInfo.sex;
      currentUser.first_name = vkUserInfo.first_name;
      currentUser.last_name = vkUserInfo.last_name;
      currentUser.nickname = "VK:" + vkUserInfo.id;
      //UserModule.SET_CURRENT_USER(currentUser);
    }

    get currentUser() {
      return UserModule.currentUser;
    }

    async onNext() {
      if (this.currentUser.nickname === "") {
        return;
      }

      if (this.currentUser.bdate === "") {
        return;
      }

      if (WebsocketModule._isUserRegistered) {
        UserModule.SAVE_CURRENT_USER();
        const currentUser = UserModule.currentUser;
        UserModule.updateProfile(currentUser);
      } else {
        const paramsForRegister = await vkService.paramsUserRegister();
        //console.log("paramsForRegister", paramsForRegister);
        const initProfile = paramsForRegister["params"]["profile"];
        initProfile.nickname = this.currentUser.nickname;
        initProfile.bdate = this.currentUser.bdate;
        initProfile.sex = this.currentUser.sex;
        initProfile.photo_1 = this.currentUser.photo_1;
        initProfile.photo_2 = this.currentUser.photo_2;
        initProfile.photo_3 = this.currentUser.photo_3;
        initProfile.photo_4 = this.currentUser.photo_4;
        console.log(paramsForRegister);
        WebsocketModule.register(paramsForRegister).then(() => {
          console.log("register success");
          WebsocketModule.auth();
        }).catch(() => {
          console.log("register error");
        });
        //paramsForRegister["profile"] = this.currentUser;
        //console.log("paramsForRegister2", paramsForRegister);
      }
      this.$router.go(-1);
      /*
            if (this.nicknameWasEmpty) {
              if (this.currentUser.nickname === "") {
                this.$router.go(-1);
              } else {
                this.$router.push("/start");
              }
            } else {
              this.$router.go(-1);
            }
      */
    }

    onDelete() {
      UserModule.delete();
    }
  }
</script>

<style
  lang="scss"
  scoped>

  .page-subtitle {
    font-size: 10pt;
    line-height: 12px;
    display: flex;
    align-items: center;
    height: 100%;
    color: $header-color-light;
  }

  .link-vk-import {
    font-size: 75%;
    line-height: 12pt;
    display: flex;
    align-items: center;
    text-decoration: underline;

    .v-image {
      margin-right: 10px;
    }
  }

  .subcontent {
    margin-top: 10px;
  }

  .small-text {
    display: flex;
    font-size: 80%;
    margin-bottom: 10px;

    &.sex {
      margin: 0;
      height: 100%;
      align-items: center;
    }
  }

  .next-container {
    margin-top: 20px;
  }
</style>
