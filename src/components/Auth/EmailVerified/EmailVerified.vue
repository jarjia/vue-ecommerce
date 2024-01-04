<script setup lang="ts">
import { SuccessIcon } from "@/components";
import router from "@/routes";
import { onMounted } from "vue";

onMounted(() => {
  router.push("/auth");
});

defineProps({
  clearStatus: {
    type: Function,
    default: true,
  },
});
</script>

<template>
  <div class="relative left-12 bottom-2">
    <SuccessIcon />
  </div>
  <img src="/images/mail.png" class="w-[200px] h-[200px]" />
  <div class="text-center">
    <p>Your email is verified!</p>
    <p>You can now log in.</p>
  </div>
  <button
    @click="
      () => {
        clearStatus();
        router.push('/login');
      }
    "
    class="bg-blue-400 capitalize px-32 text-white w-full min-w-full mt-2 py-[6px] rounded"
  >
    Log in
  </button>
</template>
