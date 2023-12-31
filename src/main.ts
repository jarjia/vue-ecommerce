import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import router from "./routes";
import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import SwiperClass, { Pagination } from "swiper";
import VueAwesomeSwiper from "vue-awesome-swiper";
import "swiper/css";

SwiperClass.use([Pagination]);

const app = createApp(App);
const pinia = createPinia();

app.use(VueAwesomeSwiper);

app.use(VueQueryPlugin);

app.use(pinia);

app.use(router);

app.mount("#app");
