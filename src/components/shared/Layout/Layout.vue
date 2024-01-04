<script setup lang="ts">
import { NotAuthorized, Navbar, SideBar } from "@/components";
import router from "@/routes";
import { getUserData } from "@/services";
import { useAuthData } from "@/store";
import { useQuery } from "@tanstack/vue-query";
import { onBeforeMount, watch } from "vue";

const { setUserData } = useAuthData();

onBeforeMount(() => {
  let auth = localStorage.getItem("auth");
  if (auth === null) {
    router.push("/login");
  }
});

const { isSuccess, isLoading, data } = useQuery({
  queryKey: ["user"],
  queryFn: getUserData,
});

watch(isSuccess, (newVal) => {
  if (newVal) {
    const { name, email, id, address, country, city } = data.value?.data;
    let userData = {
      name,
      email,
      id,
      address,
      city,
      country,
    };
    setUserData(userData);
  }
});
</script>

<template>
  <div v-if="isLoading" class="flex justify-center w-screen h-screen">
    <img src="/gifs/ecommerce.gif" alt="loading gif" />
  </div>
  <div v-else-if="!isSuccess">
    <NotAuthorized />
  </div>
  <div v-else>
    <Navbar />
    <SideBar />
    <div class="pt-28">
      <slot />
    </div>
  </div>
</template>
