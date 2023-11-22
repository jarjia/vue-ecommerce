<script lang="ts" setup>
defineProps({
  clearStatus: {
    type: Function,
    default: true,
  },
});
</script>

<template>
  <img src="/images/mail.png" class="w-[200px] h-[200px]" />
  <div class="text-center">
    <p>We sent email to provided address.</p>
    <p>please check your inbox</p>
  </div>
  <button
    type="button"
    @click="() => clearStatus()"
    class="bg-blue-400 capitalize text-white w-full min-w-full mt-2 py-[6px] rounded"
  >
    Okay
  </button>
</template>
