import { createRouter, createWebHashHistory } from "vue-router";
import {
  Auth,
  CreateProduct,
  Login,
  ProductList,
  Profile,
  ProductView,
} from "./components";

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
  {
    path: "/profile",
    name: "profile",
    component: Profile,
  },
  {
    path: "/product/create",
    name: "product create",
    component: CreateProduct,
  },
  {
    path: "/product-view/:id",
    name: "product view",
    component: ProductView,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
