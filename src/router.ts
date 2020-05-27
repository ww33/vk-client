import Vue from "vue";
import VueRouter from "vue-router";
import NotFound from "@/views/NotFound.vue";
import Home from "@/views/Home.vue";
import Start from "@/views/Start.vue";
import History from "@/views/History.vue";
import Quiz from "@/views/Quiz.vue";

//чтобы не выдавал ошибку, если пытаемся перейти на роут, на котором уже стоим
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    meta: {title: "КУ!"},
    component: Home
  },
  {
    path: "/quiz/:section",
    name: "Quiz",
    component: Quiz,
    props: true
  },
  {
    path: "*",
    meta: {title: "Страница не найдена"},
    component: NotFound
  },
  {
    path: "/start",
    name: "start",
    meta: {title: "Игра начинается!"},
    component: Start
  },
  {
    path: "/history",
    name: "history",
    meta: {title: "История"},
    component: History
  },
  {
    path: "/friends-chat",
    name: "friends-chat",
    meta: {title: "Чат друзей!"},
    component: () => import("@/views/chat/FriendsChat.vue"),
    props: true
  },
  {
    path: "/statistics",
    name: "statistics",
    meta: {title: "Статистика"},
    component: () => import("@/views/Statistics.vue")
  },
  {
    path: "/zodiac",
    name: "zodiac",
    meta: {title: "Зодиак статистика"},
    component: () => import("@/views/Zodiac.vue")
  },
  {
    path: "/messenger",
    name: "messenger",
    meta: {title: "Messenger"},
    component: () => import("@/components/Archive/Messenger.vue")
  },
  {
    path: "/profile",
    name: "profile",
    meta: {title: "Профиль"},
    component: () => import("@/views/profile/Profile.vue")
  },
  {
    path: "/profile-edit",
    name: "profileEdit",
    meta: {title: "Редактирование профиля"},
    component: () => import("@/views/profile/ProfileEdit.vue")
  },
  {
    path: "/friends-found",
    name: "friendsFound",
    meta: {title: "Друзья нашлись!"},
    component: () => import("@/views/FriendsFound.vue")
  },
  {
    path: "/events",
    name: "events",
    meta: {title: "События"},
    component: () => import("@/views/Events.vue")
  },
  {
    path: "/favorites",
    name: "favorites",
    meta: {title: "Избранные"},
    component: () => import("@/views/Favorites.vue")
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
