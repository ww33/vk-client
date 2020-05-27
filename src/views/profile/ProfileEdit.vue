<template>
  <v-container
    fluid
    class="main-content">
    <v-row
      no-gutters
      justify="center">
      <div>
        <v-row no-gutters>
          <v-avatar
            width="210"
            height="210"
            class="profile-avatar">
            <img :src="photos[0]"/>
          </v-avatar>
        </v-row>
        <v-row no-gutters>
          <v-col class="d-flex">
            <UserPhoto
              :src="photos[0]"
              :size="100"
              :index="0"
              class="profile-photo"
              @update="updatePhoto"/>
          </v-col>
          <v-col class="d-flex">
            <UserPhoto
              :src="photos[1]"
              :size="100"
              :index="1"
              class="profile-photo"
              @update="updatePhoto"/>
          </v-col>
        </v-row>
        <v-row
          no-gutters
          style="margin-top: 10px">
          <v-col class="d-flex">
            <UserPhoto
              :src="photos[2]"
              :size="100"
              :index="2"
              class="profile-photo"
              @update="updatePhoto"/>
          </v-col>
          <v-col class="d-flex">
            <UserPhoto
              :src="photos[3]"
              :size="100"
              :index="3"
              class="profile-photo"
              @update="updatePhoto"/>
          </v-col>
        </v-row>
        <span class="profile-avatar-title">
          Мои фото
        </span>
      </div>
      <div class="flex-fill profile">
        <h3 class="view-title">
          {{ currentUser.first_name }} {{ currentUser.last_name }}
        </h3>
        <p class="profile-text">
          Мои статусы для разделов
        </p>
        <div class="status-item">
          <v-row
            class="d-flex align-center status-row"
            no-gutters>
            <v-col
              cols="12"
              class="d-flex align-center ">
              <v-avatar
                class="status-avatar"
                size="50">
                <img src="@/assets/svg/category-1.svg"/>
              </v-avatar>
              <v-textarea
                v-model="currentUser.profile_h.description"
                class="profile-textarea"
                hide-details
                auto-grow
                no-resize
                rounded
                filled
                rows="2"/>
              <UserPhoto
                :src="currentUser.profile_h.photo"
                :size="70"
                :index="4"
                @update="updatePhoto">
                <v-icon color="primary">
                  mdi-camera
                </v-icon>
              </UserPhoto>
            </v-col>
          </v-row>
        </div>
        <div class="status-item">
          <v-row
            class="d-flex align-center status-row"
            no-gutters>
            <v-col
              cols="12"
              class="d-flex align-center justify-center">
              <v-avatar
                class="status-avatar"
                size="50">
                <img src="@/assets/svg/category-2.svg"/>
              </v-avatar>
              <v-textarea
                v-model="currentUser.profile_r.description"
                class="profile-textarea"
                hide-details
                auto-grow
                no-resize
                rounded
                filled
                rows="2"/>
              <UserPhoto
                :src="currentUser.profile_r.photo"
                :size="70"
                :index="5"
                @update="updatePhoto">
                <v-icon color="primary">
                  mdi-camera
                </v-icon>
              </UserPhoto>
            </v-col>
          </v-row>
        </div>
        <div class="status-item">
          <v-row
            class="d-flex align-center status-row"
            no-gutters>
            <v-col
              cols="12"
              class="d-flex align-center justify-center">
              <v-avatar
                class="status-avatar"
                size="50">
                <img src="@/assets/svg/category-3.svg"/>
              </v-avatar>
              <v-textarea
                v-model="currentUser.profile_n.description"
                class="profile-textarea"
                hide-details
                auto-grow
                no-resize
                rounded
                fille
                rows="2"/>
              <UserPhoto
                :src="currentUser.profile_n.photo"
                :size="70"
                :index="6"
                @update="updatePhoto">
                <v-icon color="primary">
                  mdi-camera
                </v-icon>
              </UserPhoto>
            </v-col>
          </v-row>
        </div>
        <div class="profile-filter">
          <h4 class="profile-filter__title">
            Показывать в Romantic
          </h4>
          <v-row
            class="profile-filter-wrap"
            align="center">
            <v-col cols="6">
              <v-range-slider
                v-model="currentUser.profile_r.age_filter"
                persistent-hint
                min="18"
                max="80"
                thumb-label="always"
                hide-details
                class="age-range"/>
              <ul class="range-title d-flex justify-space-between align-center">
                <li>
                  <span>18</span>
                </li>
                <li>
                  <span class="item-30">30</span>
                </li>
                <li>
                  <span>40</span>
                </li>
                <li>
                  <span>50</span>
                </li>
                <li>
                  <span>60</span>
                </li>
                <li>
                  <span>70</span>
                </li>
                <li>
                  <span>80</span>
                </li>
              </ul>
            </v-col>
            <v-col cols="6">
              <v-btn-toggle
                v-model="currentUser.profile_r.pref_sex"
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
                  Всех
                </v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
          <v-btn
            class="save-btn"
            @click="save">
            Сохранить и выйти
          </v-btn>
        </div>
      </div>
    </v-row>
  </v-container>
</template>

<script lang="ts">
  import { Component, Vue } from "vue-property-decorator";
  import { UserModule } from "@/store/modules/user";
  import UserPhoto from "@/views/profile/UserPhoto.vue";

  @Component({
    components: { UserPhoto }
  })
  export default class ProfileEdit extends Vue {

    get photos() {
      return [
        this.currentUser.photo_1,
        this.currentUser.photo_2,
        this.currentUser.photo_3,
        this.currentUser.photo_4
      ];
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
        // sections
        case 4:
          this.currentUser.profile_h.photo = src;
          break;
        case 5:
          this.currentUser.profile_r.photo = src;
          break;
        case 6:
          this.currentUser.profile_n.photo = src;
          break;
      }
    }

    created() {
      UserModule.load();
    }

    get currentUser() {
      return UserModule.currentUser;
    }

    save() {
      if (this.currentUser.profile_r.year === undefined || this.currentUser.profile_r.year === 0) {
        const year = this.currentUser.bdate.split("-")[0];
        if (year) {
          try {
            this.currentUser.profile_r.year = Number.parseInt(year);
          } catch (e) {
            console.error(e);
          }
        }
      }
      console.log(this.currentUser);
      UserModule.SAVE_CURRENT_USER();
      UserModule.updateProfile(this.currentUser).then(() => {
        //UserModule.SET_CURRENT_USER(this.currentUser);
        this.$router.go(-1);
      });
    }
  }
</script>

<style lang="scss">
  .profile-photo {
    .v-avatar {
      border-radius: 10px !important;
      border: solid 1px #C0C0C0;
    }
  }
</style>

<style
  lang="scss"
  scoped>

  .view-title {
    margin-left: 0;
  }

  .range-title {
    list-style: none;
    padding-left: 1px;

    span {
      font-weight: 500;
      font-size: 12px;
      color: #C8C8C8;
    }
  }

  .profile-filter-wrap {
    padding-bottom: 50px;
  }

  .profile-filter {
    padding-bottom: 25px;
  }

  .save-btn {
    display: block;
    background: linear-gradient(150.26deg, #4690FF 20.7%, #16C1F8 96.61%);
    border-radius: 30px;
    width: 100%;
    max-width: 300px;
    height: 45px;
    line-height: 45px;
    color: #fff;
  }

  .sex-filter-item {
    input {
      display: none;

      &:checked + label {
        background: linear-gradient(150.26deg, #4690FF 20.7%, #16C1F8 96.61%);
        color: #fff;
        transition: all 0.3s;
      }
    }

    label {
      display: block;
      padding: 0 5px;
      height: 36px;
      line-height: 36px;
      margin: 0 10px;
      min-width: 92px;
      text-align: center;
      background: #FFFFFF;
      box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
      border-radius: 20px;
      cursor: pointer;
      transition: all 0.3s;
    }
  }

  .profile-filter__title {
    font-size: 16px;
    margin-top: 30px;
    margin-bottom: 40px;
    font-weight: 300;
    color: #646363;
  }

  .profile-avatar-title {
    font-size: 16px;
    color: #788EA8;
  }

  .profile-avatar {
    margin-bottom: 10px;
    margin-right: 10px;
    border-radius: 15px;
  }

  .profile-text {
    font-size: 16px;
    line-height: 1;
    font-weight: 300;
    color: #646363;
    margin-bottom: 20px;
  }

  .status-avatar {
    margin-right: 20px;
  }

  .status-row {
    max-width: 710px;
  }

  .item-30 {
    margin-left: 1.25vw;
  }

  .profile {
    margin-left: 5vh;
  }
</style>
