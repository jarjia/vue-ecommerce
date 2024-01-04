import { createRouter, createWebHashHistory } from "vue-router";
import {
  Auth,
  CreateProduct,
  Login,
  ProductList,
  Dashboard,
  ProductView,
  EditProduct,
  Cart,
  AboutUs,
  ContactUs,
  Checkout,
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
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
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
  {
    path: "/product/edit/:id",
    name: "product edit",
    component: EditProduct,
  },
  {
    path: "/cart",
    name: "cart",
    component: Cart,
  },
  {
    path: "/about-us",
    name: "about us",
    component: AboutUs,
  },
  {
    path: "/contact-us",
    name: "contact us",
    component: ContactUs,
  },
  {
    path: "/checkout",
    name: "checkout",
    component: Checkout,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
