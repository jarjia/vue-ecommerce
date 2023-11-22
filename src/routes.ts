import { createRouter, createWebHashHistory } from "vue-router";
import { Auth, Login, ProductList } from "./components";

const routes = [
  {
    path: "/",
    redirect: () => {
      return "login";
    },
  },
  {
    path: "/product-list",
    name: "product-list",
    component: ProductList,
  },
  {
    path: "/auth",
    name: "auth",
    component: Auth,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
