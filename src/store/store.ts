import { defineStore } from "pinia";

export const useAuthData = defineStore("auth", {
  state: (): {
    cities: string[];
  } => {
    return {
      cities: [],
    };
  },
  actions: {
    setCities(cities: string[]) {
      this.cities = cities;
    },
  },
});
