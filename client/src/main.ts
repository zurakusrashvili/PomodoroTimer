import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "@/plugins/vuetify";
import Vue from "vue";
import store from "@/store/store";
import router from "@/router/router";

createApp(App).use(router).use(vuetify).use(store).mount("#app");
