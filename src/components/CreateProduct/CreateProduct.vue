<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import useCreateProduct from "./useCreateProduct";
import { numberWithCommas } from "@/helpers";
import { Layout, ImageIcon, PlusIcon } from "@/components";

const {
  price,
  quantity,
  name,
  type,
  description,
  isDemo,
  errors,
  images,
  handleChange,
  handleDelete,
  handleDrop,
  handleDragOver,
  handleDropChange,
  onSubmit,
  goToSlide,
  uploadFiles,
  onSwiper,
  submitCount,
  modules,
  isPending,
} = useCreateProduct();
</script>

<template>
  <Layout>
    <form
      @submit="onSubmit"
      class="grid grid-cols-2 px-24 gap-4 big-h:grid-cols-1 avg-desk-for-view:px-8 avg-desk-for-view:grid-cols-1 items-start h-[calc(100vh-200px)]"
      novalidate
    >
      <div class="w-full avg-desk-for-view:pb-4">
        <div
          :class="
            errors.images && submitCount > 0 && !isDemo
              ? 'border-red-500 img-err'
              : 'border-transparent'
          "
          class="slider-shadow border-2 relative h-[400px] overflow-hidden w-full rounded"
        >
          <div class="absolute h-[400px] w-full rounded">
            <div
              v-if="images.length === 0"
              @drop.prevent="(e) => handleDrop(e)"
              @dragover="handleDragOver"
            >
              <label
                class="absolute z-[20] h-full w-full flex flex-col justify-center items-center"
              >
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  @change="uploadFiles"
                  class="hidden"
                />
                <div
                  class="flex gap-3 capitalize bg-blue-400 rounded text-white w-fit p-2 cursor-pointer"
                >
                  add images
                  <ImageIcon />
                </div>
                <p>or</p>
                <div>
                  <p class="underline">Drag and drop</p>
                </div>
              </label>
            </div>
            <Swiper
              :modules="modules"
              :allow-touch-move="true"
              class="h-full duration-700"
              :navigation="true"
              @swiper="onSwiper"
            >
              <SwiperSlide
                v-for="(item, index) in images"
                :key="index"
                class="bg-center bg-no-repeat bg-contain cursor-pointer"
                :style="{
                  backgroundImage: 'url(' + item.img + ')',
                }"
              >
                <div
                  v-if="!isDemo"
                  class="flex flex-col justify-center items-center h-full"
                >
                  <label
                    @drop.prevent="(e) => handleDropChange(e, index)"
                    @dragover="handleDragOver"
                    class="text-center border-dashed border-blue-400 border-2 h-fit text-white bg-[#398fc870] p-2"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleChange(e, index)"
                      class="hidden"
                    />
                    <p>Upload new image</p>
                    <p>or</p>
                    <p>Drag and drop</p>
                  </label>
                  <button
                    @click="() => handleDelete(index)"
                    class="capitalize bg-opacity-70 bg-red-400 rounded p-2 mt-2 text-white"
                  >
                    remove
                  </button>
                </div>
              </SwiperSlide>
              <SwiperSlide
                v-if="images.length > 0 && images.length < 9 && !isDemo"
              >
                <div
                  @drop.prevent="(e) => handleDrop(e)"
                  @dragover="handleDragOver"
                >
                  <label
                    class="absolute z-[99] h-full w-full flex flex-col justify-center items-center"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      @change="uploadFiles"
                      class="hidden"
                    />
                    <div
                      class="flex gap-3 capitalize bg-blue-400 rounded text-white w-fit p-2 cursor-pointer"
                    >
                      upload images
                      <ImageIcon />
                    </div>
                    <p>or</p>
                    <div>
                      <p class="underline">Drag and drop</p>
                    </div>
                  </label>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
        <div class="relative">
          <div
            v-if="images.length > 0"
            class="absolute w-full flex justify-center"
          >
            <div
              class="border-2 border-t-0 border-blue-400 py-1 flex items-center w-fit gap-3 av-desk:gap-[6px] rounded-b justify-center px-4"
            >
              <div
                @click="goToSlide(index)"
                v-for="(item, index) in images"
                :style="{
                  backgroundImage: 'url(' + item.img + ')',
                }"
                class="w-8 h-8 bg-center cursor-pointer bg-contain hover:scale-110 active:scale-125 bg-no-repeat"
              ></div>
              <div
                v-if="images.length > 0 && images.length < 9 && !isDemo"
                @click="goToSlide(images.length + 1)"
                title="add more images"
                class="flex m-auto gap-3 capitalize bg-blue-400 text-white rounded cursor-pointer"
              >
                <PlusIcon :isViewer="true" />
              </div>
            </div>
          </div>
        </div>
        <p
          v-if="images.length === 0"
          class="text-center pt-2 text-sm text-gray-500"
        >
          *Remember! first image in the list will be shown on product card
        </p>
      </div>
      <div class="relative">
        <div
          class="flex text-xl items-center justify-between border-b-2 py-1 pb-2 border-black"
        >
          <h3
            v-if="name.value && name.value?.length > 0 && isDemo"
            class="text-black"
          >
            {{ name.value }}
          </h3>
          <input
            v-else
            type="text"
            v-bind="name"
            class="mt-1 bg-transparent border-2 z-[3] font-sans border-black outline-none text-base px-1"
          />
          <p class="text-red-500 text-sm" v-if="errors.name && !isDemo">
            {{ errors.name }}
          </p>
        </div>
        <div class="mt-1 min-h-[200px]">
          <div
            class="capitalize items-center justify-center flex gap-2 text-2xl text-center mb-1"
          >
            product description
          </div>

          <p
            v-if="description.value && description.value?.length > 0 && isDemo"
            class="text-center break-words"
          >
            {{ description.value }}
          </p>
          <textarea
            v-else
            v-bind="description"
            class="w-full max-w-full scrollbar h-40 max-h-48 border-black border-2 p-1 outline-none text-base"
          ></textarea>
          <div class="relative pb-4 bottom-1">
            <p
              class="text-red-500 absolute text-sm"
              v-if="errors.description && !isDemo"
            >
              {{ errors.description }}
            </p>
          </div>
        </div>
        <div class="flex items-center mt-1 gap-4">
          <div class="flex gap-4">
            <p>Price:</p>
          </div>
          <p v-if="isDemo">${{ numberWithCommas(price.value as number) }}</p>
          <div v-else class="relative w-full bottom-3">
            <div class="flex items-center gap-2 absolute">
              <input
                type="number"
                min="1"
                max="100000"
                v-bind="price"
                class="bg-transparent border-2 z-[3] w-32 font-sans border-black outline-none text-base px-1"
              />
              <p class="text-red-500 text-sm" v-if="errors.price && !isDemo">
                {{
                  errors.price.includes("string")
                    ? "Product price is required"
                    : errors.price
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center mt-2 gap-4">
          <div class="flex gap-4">
            <p>Quantity:</p>
          </div>
          <p v-if="isDemo">
            {{ quantity.value }}
          </p>
          <div v-else class="relative w-full bottom-3">
            <div class="flex items-center gap-2 absolute">
              <input
                type="number"
                min="1"
                max="100"
                v-bind="quantity"
                class="bg-transparent border-2 z-[3] w-32 font-sans border-black outline-none text-base px-1"
              />
              <p class="text-red-500 text-sm" v-if="errors.quantity && !isDemo">
                {{
                  errors.quantity.includes("string")
                    ? "Product quantity is required"
                    : errors.quantity
                }}
              </p>
            </div>
          </div>
        </div>
        <div class="flex items-center mt-2 gap-4">
          <div class="flex gap-4">
            <p>Type:</p>
          </div>
          <p v-if="type.value && type.value?.length > 0 && isDemo">
            {{ type.value }}
          </p>
          <input
            v-else
            type="text"
            v-bind="type"
            class="mt-1 bg-transparent border-2 z-[3] font-sans border-black outline-none text-base px-1"
          />
          <p class="text-red-500 text-sm" v-if="errors.type && !isDemo">
            {{ errors.type }}
          </p>
        </div>
        <div class="flex flex-col gap-2 mt-3 mb-4">
          <button
            type="submit"
            :disabled="isPending || isDemo"
            class="bg-blue-400 hover:bg-blue-500 disabled:bg-blue-300 text-white py-2 rounded capitalize"
          >
            submit
          </button>
          <button
            type="button"
            v-if="!isDemo"
            @click="isDemo = true"
            class="bg-blue-400 capitalize hover:bg-blue-500 px-2 py-[1px] text-base text-white rounded"
          >
            see demo
          </button>
          <button
            type="button"
            v-else
            @click="isDemo = false"
            class="bg-blue-400 capitalize hover:bg-blue-500 px-2 py-[1px] text-base text-white rounded"
          >
            edit
          </button>
        </div>
      </div>
    </form>
  </Layout>
</template>
