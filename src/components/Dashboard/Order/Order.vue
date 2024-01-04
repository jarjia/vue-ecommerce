<script setup lang="ts">
import { numberWithCommas } from "@/helpers";
import { cancelOrder } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();

const { mutate: cancelOrderMutation } = useMutation({
  mutationFn: cancelOrder,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["orders"] });
  },
});

defineProps({
  name: {
    type: String,
    default: true,
  },
  price: {
    type: Number,
    default: true,
  },
  id: {
    type: Number,
    default: true,
  },
  arrives_at: {
    type: String,
    default: true,
  },
  created_at: {
    type: String,
    default: true,
  },
});
</script>

<template>
  <div
    class="flex items-center justify-center bg-[#EDEDED] w-full rounded-xl p-2 gap-2"
  >
    <div class="flex flex-col justify-center items-center">
      <img src="/images/logo.png" class="max-w-[70px] max-h-[70px]" />
      <p class="text-[12px] mt-1 truncate">${{ numberWithCommas(price) }}</p>
    </div>
    <div class="flex flex-col gap-1">
      <div class="flex flex-col justify-between">
        <h3>{{ name }}</h3>
      </div>
      <p class="text-[13px] text-[#303030]">
        {{
          new Date(created_at).toISOString().split("T")[0].replace(/-/g, "/")
        }}
        -
        {{
          new Date(arrives_at).toISOString().split("T")[0].replace(/-/g, "/")
        }}
      </p>
      <button
        @click="cancelOrderMutation(id)"
        class="bg-[#FA6060] rounded-[5px] text-white py-[2px] px-2"
      >
        Cancel
      </button>
    </div>
  </div>
</template>
