<script setup lang="ts">
import router from "@/routes";
import { onMounted } from "vue";

onMounted(() => {
  localStorage.removeItem("auth");
});

const handleRedirect = () => {
  localStorage.removeItem("auth");
  router.push("/login");
};
</script>

<template>
  <div
    class="absolute top-1/2 left-1/2 w-1/2 sm-mobile:w-full sm-mobile:px-2 transform -translate-x-1/2 -translate-y-1/2"
  >
    <div class="h-[55%] w-[55%] m-auto">
      <img src="/images/401.jpg" class="w-full h-full" alt="401 not allowed" />
    </div>
    <div class="flex flex-col gap-2 m-auto text-center">
      <h2 class="text-2xl">401 not authorized</h2>
      <p>looks like you are not authorized to visit this page.</p>
      <button
        @click="handleRedirect"
        class="bg-red-400 w-80 max-w-full m-auto py-2 rounded text-white"
      >
        Go to login
      </button>
    </div>
  </div>
</template>
