<script setup lang="ts">
import { Layout, ThumbnailViewer, TrashBinIcon, PenIcon } from "@/components";
import router from "@/routes";
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { ref } from "vue";

const modules = [Navigation];

const isShowThumbnails = ref(false);
const swiperInstance = ref();
const slide = ref(0);

function onSwiper(swiper: any) {
  swiperInstance.value = swiper;
}

function goToSlide(position: number) {
  swiperInstance.value.slideTo(position);
}

const handleOffViewer = () => {
  isShowThumbnails.value = false;
};

const handleOnViewer = () => {
  isShowThumbnails.value = true;
};

const handleThumbnailViewer = (index: number) => {
  slide.value = index;
  setTimeout(() => {
    isShowThumbnails.value = !isShowThumbnails.value;
  }, 100);
};

const arr = [
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/logo.png",
    text: "slide 1",
  },
  {
    img: "/images/form.png",
    text: "slide 2",
  },
  {
    img: "/images/401.jpg",
    text: "slide 3",
  },
  {
    img: "/images/mail.png",
    text: "slide 4",
  },
  {
    img: "/images/user.png",
    text: "slide 5",
  },
];
</script>

<template>
  <ThumbnailViewer
    v-if="isShowThumbnails"
    :handleOffViewer="handleOffViewer"
    :handleOnViewer="handleOnViewer"
    :images="arr"
    :slide="slide"
  />
  <Layout>
    <div
      class="grid grid-cols-2 px-24 gap-4 big-h:grid-cols-1 avg-desk-for-view:px-8 avg-desk-for-view:grid-cols-1 items-center h-[calc(100vh-200px)]"
    >
      <div class="w-full">
        <div
          class="slider-shadow relative h-[400px] overflow-hidden w-full rounded"
        >
          <div class="absolute h-[400px] w-full rounded">
            <Swiper
              :modules="modules"
              :allow-touch-move="true"
              class="h-full"
              :navigation="true"
              :loop="true"
              @swiper="onSwiper"
            >
              <SwiperSlide
                v-for="(item, index) in arr"
                :key="index"
                @click="handleThumbnailViewer(index)"
                class="bg-center bg-no-repeat bg-contain cursor-pointer"
                :style="{
                  backgroundImage: 'url(' + item.img + ')',
                }"
              >
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <div
            class="border-2 border-t-0 border-blue-400 py-1 flex w-fit gap-3 rounded-b justify-center px-4"
          >
            <div
              @click="goToSlide(index + 1)"
              v-for="(item, index) in arr"
              :style="{
                backgroundImage: 'url(' + item.img + ')',
              }"
              class="w-8 h-8 bg-center cursor-pointer bg-contain hover:scale-110 active:scale-125 bg-no-repeat"
            ></div>
          </div>
        </div>
      </div>
      <div>
        <div
          class="flex text-xl items-center justify-between border-b-2 py-1 pb-2 border-black"
        >
          <h3>Poco F4 GT</h3>
          <div class="flex gap-2">
            <button class="p-2 py-[6px] rounded bg-blue-400">
              <PenIcon />
            </button>
            <button class="p-2 py-[6px] rounded bg-red-400">
              <TrashBinIcon />
            </button>
          </div>
        </div>
        <div class="mt-4">
          <h4 class="capitalize text-2xl text-center mb-1">
            product description
          </h4>
          <p class="text-center">
            One thing to note when using routes with params is that when the
            user navigates from /users/johnny to /users/jolyne, the same
            component instance will be reused. Since both routes render the same
            component, this is more efficient than destroying the old instance
            and then creating a new one. However, this also means that the
            lifecycle hooks of the component will not be called.
          </p>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Price:</p>
          <span>$999.99</span>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Quantity:</p>
          <span>9</span>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Type:</p>
          <span>Eloctronical</span>
        </div>
        <div class="flex flex-col gap-2 mt-6 mb-4">
          <button
            class="bg-blue-400 hover:bg-blue-500 text-white py-2 rounded capitalize"
          >
            add to cart
          </button>
          <button
            @click="router.back()"
            class="bg-[#bebebe] hover:bg-[#9e9e9e] shadow text-white py-2 rounded capitalize"
          >
            go back
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>
