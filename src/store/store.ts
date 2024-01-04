import { defineStore } from "pinia";
import { UserData } from "./types";

export const useAuthData = defineStore("auth", {
  state: (): {
    cities: string[];
    userData: null | UserData;
    totalCartPrice: number;
    sideBar: boolean;
  } => {
    return {
      cities: [],
      userData:
        sessionStorage.getItem("user-data") !== "[object Object]"
          ? JSON.parse(sessionStorage.getItem("user-data") as string)
          : null,
      totalCartPrice: 0,
      sideBar: false,
    };
  },
  actions: {
    setSideBar(boolean: boolean) {
      this.sideBar = boolean;
    },
    setCities(cities: string[]) {
      this.cities = cities;
    },
    setUserData(data: UserData) {
      this.userData = data;
      sessionStorage.setItem("user-data", JSON.stringify(data));
    },
    setInitialCartPrice(total: number) {
      this.totalCartPrice = total;
    },
    setChangingCartPrice(price: number) {
      this.totalCartPrice += price;
    },
  },
});
