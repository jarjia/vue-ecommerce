<script setup lang="ts">
import { loadImage, isFreeProduct } from "@/helpers";
import router from "@/routes";

const props = defineProps({
  price: {
    type: String,
    default: true,
  },
  name: String,
  mainImage: String,
  id: Number,
  isInStock: Boolean,
  thumbnails: {
    type: Array,
    default: true,
  },
});

loadImage(props.thumbnails as string[]);
</script>

<template>
  <div
    :style="{
      backgroundImage: 'url(' + mainImage + ')',
    }"
    class="grid grid-rows-[65%_35%] bg-center bg-contain bg-no-repeat h-[250px] shadow-xl rounded-xl"
  >
    <div class="relative">
      <div class="absolute right-0 m-2">
        <p
          class="text-sm select-none text-white py-[2px] rounded-xl px-2"
          :class="isInStock ? 'bg-[#85E264]' : 'bg-red-400'"
        >
          {{ isInStock ? "in stock" : "out of stock" }}
        </p>
      </div>
    </div>
    <div
      class="product-linear w-full flex flex-col justify-center rounded-b-xl px-4 av-desk:px-2"
    >
      <div class="flex justify-between pb-1">
        <p class="text-white w-40 truncate">
          {{
            ((name?.charAt(0).toUpperCase() as string) +
              name?.substring(1)) as string
          }}
        </p>
        <p class="text-white capitalize">
          {{ isFreeProduct(props.price) ? "free" : "$" + price }}
        </p>
      </div>
      <button
        @click="router.push(`/product-view/${id}`)"
        class="capitalize text-white py-1 rounded-2xl w-full bg-[#60A5FA]"
      >
        show more
      </button>
    </div>
  </div>
</template>
