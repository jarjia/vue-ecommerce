<script setup lang="ts">
import { NotAuthorized, Navbar } from "@/components";
import { getUserData } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { watch } from "vue";

const { isSuccess, isLoading } = useQuery({
  queryKey: ["user"],
  queryFn: getUserData,
});

watch(isSuccess, (newVal) => {
  if (!newVal) {
    localStorage.removeItem("auth");
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
    <div class="pt-28">
      <slot />
    </div>
  </div>
</template>
