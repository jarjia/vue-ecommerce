<script setup lang="ts">
import { useAuthData } from "@/store";
import { numberWithCommas } from "@/helpers";

defineProps({
  onDeleteCartItemsMutation: {
    type: Function,
    default: true,
  },
  quantity: {
    type: Number,
    default: true,
  },
});

const cart = useAuthData();
</script>

<template>
  <div class="flex justify-end gap-4 pb-2 border-b-[1px] border-b-black">
    <button
      :disabled="quantity === 0"
      @click="onDeleteCartItemsMutation()"
      class="capitalize text-white bg-red-400 disabled:bg-red-300 py-2 px-4 rounded"
    >
      remove all
    </button>
    <button
      @click="$router.push('/checkout')"
      :disabled="quantity === 0"
      class="capitalize text-white bg-blue-400 disabled:bg-blue-300 py-2 px-4 rounded"
    >
      checkout <span class="pr-[1px]">(</span>${{
        numberWithCommas(parseFloat(cart.totalCartPrice.toFixed(2)))
      }}<span class="pl-[1px]">)</span>
    </button>
  </div>
</template>
