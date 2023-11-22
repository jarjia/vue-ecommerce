<script setup lang="ts">
import router from "@/routes";
import { getUserData } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { onBeforeMount, watch } from "vue";
import { Navbar, Product, Filter, Search } from "@/components";

const { isSuccess, isLoading } = useQuery({
  queryKey: ["user"],
  queryFn: getUserData,
});

watch(isSuccess, (newVal) => {
  if (!newVal) {
    localStorage.removeItem("auth");
  }
});

onBeforeMount(() => {
  let auth = localStorage.getItem("auth");
  if (auth === null) {
    router.push("/login");
  }
});
</script>

<template>
  <div v-if="isLoading">Loading...</div>
  <div v-else-if="!isSuccess">401 not allowed</div>
  <div v-else>
    <Navbar />
    <div
      class="flex items-center justify-end border-b-[1px] border-black mx-16 pt-8 pb-4 gap-6"
    >
      <div class="flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          class="border-[1px] rounded-full placeholder:text-black pl-2 pr-7 py-1 w-80 border-black outline-none"
        />
        <div class="relative bottom-3 right-[32px]">
          <Search class="absolute" />
        </div>
      </div>
      <button>
        <Filter />
      </button>
    </div>
    <div class="grid grid-cols-4 px-16 gap-10 pt-4">
      <Product />
      <Product />
      <Product />
      <Product />
    </div>
  </div>
</template>
