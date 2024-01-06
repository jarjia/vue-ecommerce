<script setup lang="ts">
import { ref } from "vue";
import { numberWithCommas } from "@/helpers";

defineProps({
  name: {
    type: String,
    default: true,
  },
  type: {
    type: String,
    default: true,
  },
  quantity: {
    type: Number,
    default: true,
  },
  price: {
    type: Number,
    default: true,
  },
  description: {
    type: String,
    default: true,
  },
});

const showDescription = ref(false);
</script>

<template>
  <div class="border-b-[1px] border-black pb-2 w-full float-right pt-2">
    <div class="flex flex-row-reverse justify-between items-center">
      <div class="flex flex-col">
        <h4 class="text-xl w-full text-right pb-1 truncate">
          {{ name }}
        </h4>
        <p class="text-right">
          1 piece -
          <span class="text-blue-400">${{ numberWithCommas(price) }}</span>
        </p>
        <p
          class="sm-mobile:flex sm-mobile:flex-col sm-mobile:text-sm text-right"
        >
          Ordering {{ quantity }} piece(s) - {{ type }} -
          <span class="text-blue-400"
            >${{ numberWithCommas(quantity * price) }}</span
          >
        </p>
        <button
          @click="showDescription = !showDescription"
          class="text-right text-blue-400"
        >
          {{ showDescription ? "close" : "see" }} description
        </button>
      </div>
    </div>
    <div class="relative">
      <p
        class="text-right break-words pt-2 transition-opacity duration-500 avg-desk-for-view:text-sm"
        :class="
          showDescription
            ? 'h-auto opacity-1'
            : 'opacity-0 h-0 overflow-y-hidden select-none'
        "
      >
        {{ description }}
      </p>
    </div>
  </div>
</template>
