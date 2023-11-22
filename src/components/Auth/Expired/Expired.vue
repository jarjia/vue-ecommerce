<script setup lang="ts">
import router from "@/routes";
import { postSendVerify } from "@/services";
import { useMutation } from "@tanstack/vue-query";
import { Spinner } from "@/components";

const props = defineProps({
  clearStatus: {
    type: Function,
    default: true,
  },
});

const { mutate: sendVerifyMutation, isPending } = useMutation({
  mutationFn: postSendVerify,
  onSuccess() {
    props.clearStatus();
    router.push("/login");
  },
});
</script>

<template>
  <img src="/images/expired.png" class="w-[200px] h-[200px]" />
  <div class="text-center">
    <p>The link is expired!</p>
    <p>Click the button below to send a new one.</p>
  </div>
  <button
    :disabled="isPending"
    @click="
      () => {
        sendVerifyMutation({
          email: router.currentRoute.value.query.email,
        });
      }
    "
    class="bg-yellow-400 capitalize px-32 text-white w-full min-w-full mt-2 py-[6px] rounded"
  >
    <Spinner v-if="isPending" />
    <span v-else>Re-send</span>
  </button>
  <button
    :disabled="isPending"
    @click="
      () => {
        router.push('/login');
        clearStatus();
      }
    "
    class="bg-blue-400 capitalize px-32 text-white w-full min-w-full py-[6px] rounded"
  >
    Go to login
  </button>
</template>
