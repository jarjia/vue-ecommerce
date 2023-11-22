<script setup lang="ts">
import router from "@/routes";
import { Cart } from "@/components";
import { logOutUser, postTest } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const { mutate: logOutMutation } = useMutation({
  mutationFn: logOutUser,
  onSuccess() {
    localStorage.removeItem("auth");
    router.push("/login");
  },
});

const fetch = async () => {
  try {
    const res = await postTest();
    console.log(res);
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <nav class="flex justify-between bg-white shadow p-4 px-8">
    <div class="flex items-center gap-2">
      <img src="/images/logo.png" alt="logo" class="w-9 h-9" />
      <p class="text-lg">Your Ecommerce</p>
    </div>
    <div class="flex items-center gap-4">
      <button class="hover:bg-gray-100 p-2 rounded-full">
        <Cart />
      </button>
      <button
        @click="
          () => {
            logOutMutation();
            queryClient.clear();
          }
        "
        class="capitalize border-2 border-black py-1 px-2 rounded"
      >
        log out
      </button>
      <button @click="fetch">click</button>
    </div>
  </nav>
</template>
