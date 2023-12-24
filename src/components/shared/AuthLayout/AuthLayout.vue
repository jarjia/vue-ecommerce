<script setup lang="ts">
import router from "@/routes";
import { onBeforeMount } from "vue";
import { loadImage } from "@/helpers";
import { useQuery } from "@tanstack/vue-query";
import { getCrsfToken } from "@/services";

useQuery({
  queryKey: ["csrf-token"],
  queryFn: getCrsfToken,
});

onBeforeMount(() => {
  loadImage(["/images/form.png"]);
  let auth = localStorage.getItem("auth");
  if (auth === "yes") {
    router.push("/product-list");
  }
});
</script>
<template>
  <div
    class="flex justify-center shadow-2xl bg-center bg-cover bg-no-repeat w-screen h-screen sm:h-screen"
    style="background-image: url('/images/form.png')"
  >
    <div
      class="flex items-stretch justify-center overflow-y-auto scrollbar bg-[#DBE7FFe5] min-w-[45%] sm:w-full h-auto bg-cover bg-[80%_50%] z-[3] my-4 sm:my-0 sm:mt-4 py-4 sm:rounded-b-none rounded-2xl"
    >
      <slot />
    </div>
  </div>
</template>
