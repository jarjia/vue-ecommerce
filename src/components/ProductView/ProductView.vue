<script setup lang="ts">
import { Layout, ThumbnailViewer, TrashBinIcon, PenIcon } from "@/components";
import router from "@/routes";
import { Swiper, SwiperSlide } from "swiper/vue";
import useProductView from "./useProductView";
import { isFreeProduct } from "@/helpers";

const {
  handleOffViewer,
  handleOnViewer,
  handleThumbnailViewer,
  modules,
  onSwiper,
  goToSlide,
  slide,
  isShowThumbnails,
  isLoading,
  deleteProductMutation,
  data,
  userData,
  isAlreadyInCart,
  createCartItemMutation,
} = useProductView();
</script>

<template>
  <ThumbnailViewer
    v-if="isShowThumbnails && !isLoading && data?.data"
    :handleOffViewer="handleOffViewer"
    :handleOnViewer="handleOnViewer"
    :images="data?.data.thumbnails"
    :slide="slide"
  />

  <Layout>
    <div v-if="isLoading" class="flex items-center justify-center">
      <img src="/gifs/loading.gif" />
    </div>
    <div
      v-if="!isLoading && data?.data"
      class="grid grid-cols-2 px-24 items-start gap-4 big-h:grid-cols-1 avg-desk-for-view:px-8 avg-desk-for-view:grid-cols-1 h-[calc(100vh-200px)]"
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
                v-for="(item, index) in data.data.thumbnails"
                :key="index"
                @click="handleThumbnailViewer(index)"
                class="bg-center bg-no-repeat bg-contain cursor-pointer"
                :style="{
                  backgroundImage: 'url(' + item + ')',
                }"
              >
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div class="w-full flex justify-center">
          <div
            class="border-2 border-t-0 items-center border-blue-400 py-1 flex w-fit gap-3 av-desk:gap-[6px] rounded-b justify-center px-4"
          >
            <div
              @click="goToSlide(index + 1)"
              v-for="(item, index) in data.data.thumbnails"
              :style="{
                backgroundImage: 'url(' + item + ')',
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
          <h3>{{ data.data.name }}</h3>
          <div
            v-if="
              userData?.id === data.data?.owner_id &&
              userData !== null &&
              userData.id
            "
            class="flex gap-2"
          >
            <button
              @click="router.push(`/product/edit/${data.data.id}`)"
              class="p-2 py-[6px] rounded bg-blue-400"
            >
              <PenIcon />
            </button>
            <button
              @click="() => deleteProductMutation(data?.data.id)"
              class="p-2 py-[6px] rounded bg-red-400"
            >
              <TrashBinIcon />
            </button>
          </div>
        </div>
        <div class="mt-1 min-h-[200px]">
          <h4 class="capitalize text-2xl text-center mb-1">
            product description
          </h4>
          <p class="text-center">
            {{ data.data.description }}
          </p>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Price:</p>
          <span
            >${{ data.data.price }}
            <span class="pl-1">{{
              isFreeProduct(data.data.price) ? "(Free)" : ""
            }}</span>
          </span>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Quantity:</p>
          <span>{{ data.data.quantity }}</span>
        </div>
        <div class="flex mt-2 gap-4">
          <p>Type:</p>
          <span>{{ data.data.type }}</span>
        </div>
        <div class="flex flex-col gap-2 mt-6 mb-4">
          <button
            @click="
              createCartItemMutation({
                seller_id: data.data.owner_id,
                product_id: data.data.id,
              })
            "
            :class="
              isAlreadyInCart ? 'bg-red-400' : 'bg-blue-400 hover:bg-blue-500'
            "
            class="text-white py-2 rounded capitalize"
          >
            {{ isAlreadyInCart ? "already in cart!" : "add to cart" }}
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
