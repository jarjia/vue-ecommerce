<script setup lang="ts">
import { PlusIcon } from "@/components";
import { Navigation, Pagination, Zoom } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

const modules = [Navigation, Pagination, Zoom];

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
    class="fixed h-screen w-screen sm:hidden block bg-[#13131ae1] z-[999]"
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
          :zoom="true"
          class="w-full h-full"
          id="thumbnails"
          style="padding-bottom: 40px"
        >
          <SwiperSlide v-for="item in images" :key="item">
            <div class="swiper-zoom-container">
              <img
                title="click twice to zoom"
                :src="item"
                :alt="item"
                class="cursor-move"
              />
            </div>
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
