<script setup lang="ts">
import { PlusIcon } from "@/components";
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const modules = [Navigation, Pagination];

defineProps({
  handleOffViewer: {
    type: Function,
    default: true,
  },
  handleOnViewer: {
    type: Function,
    default: true,
  },
  images: Object,
  slide: Number,
});
</script>

<template>
  <div
    @click="
      () => {
        handleOffViewer();
      }
    "
    class="fixed h-screen w-screen sm:hidden block bg-[#13131ad2] z-[999]"
  >
    <button class="float-right rotate-45 m-6 z-[10]" @click="handleOffViewer()">
      <PlusIcon :isViewer="true" />
    </button>
    <div
      class="h-full w-full z-[-5] relative flex items-center bottom-10 justify-center"
    >
      <div
        class="h-4/6 w-1/2"
        @click="
          (e) => {
            e.stopPropagation();
          }
        "
      >
        <Swiper
          :modules="modules"
          :pagination="{ type: 'fraction' }"
          :navigation="true"
          :initialSlide="slide"
          class="w-full h-full"
          id="thumbnails"
          style="padding-bottom: 40px"
        >
          <SwiperSlide
            v-for="(item, index) in images"
            :key="index"
            class="bg-center bg-no-repeat bg-contain cursor-pointer"
            :style="{
              backgroundImage: 'url(' + item.img + ')',
            }"
          >
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  </div>
</template>

<style>
.swiper-pagination {
  color: white;
}
#thumbnails .swiper-button-prev {
  color: white !important;
}
#thumbnails .swiper-button-next {
  color: white !important;
}
</style>
