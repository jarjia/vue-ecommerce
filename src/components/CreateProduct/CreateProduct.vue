<script setup lang="ts">
import { Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import { ref } from "vue";
import { Layout, ImageIcon } from "@/components";

const modules = [Navigation];

const files = ref<File[]>([]);
const images = ref<{ img: string; type?: string }[]>([]);
const swiperInstance = ref();

const uploadFiles = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    const imgs = target.files;
    for (let i = 0; i < imgs.length; i++) {
      if (files.value.length < 9) {
        images.value.push({
          img: URL.createObjectURL(imgs[i]),
        });
        files.value.push(imgs[i]);
      }
    }
  }
};

const handleDrop = (e: DragEvent) => {
  const imgs = e.dataTransfer?.files;

  if (imgs && imgs.length > 0) {
    for (let i = 0; i < imgs.length; i++) {
      if (files.value.length < 9) {
        images.value.push({
          img: URL.createObjectURL(imgs[i]),
        });
        files.value.push(imgs[i]);
      }
    }
  }
};
const handleDropChange = (e: DragEvent, index: number) => {
  const droppedFiles = e.dataTransfer?.files;

  if (droppedFiles && droppedFiles.length > 0) {
    const droppedFile = droppedFiles[0];

    files.value.splice(index, 1, droppedFile);

    images.value.splice(index, 1, {
      img: URL.createObjectURL(droppedFile),
    });
  }
};

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
};

const handleDelete = (index: number) => {
  files.value.splice(index, 1);
  images.value.splice(index, 1);
};

const handleChange = (e: Event, index: number) => {
  const target = e.target as HTMLInputElement;

  if (target?.files?.length) {
    const selectedFile = target.files[0];

    files.value.splice(index, 1, selectedFile);

    images.value.splice(index, 1, {
      img: URL.createObjectURL(selectedFile),
    });
  }
};

const onSwiper = (swiper: any) => {
  swiperInstance.value = swiper;
};

const goToSlide = (position: number) => {
  swiperInstance.value.slideTo(position);
};
</script>

<template>
  <Layout>
    <div
      class="grid grid-cols-2 px-24 gap-4 big-h:grid-cols-1 avg-desk-for-view:px-8 avg-desk-for-view:grid-cols-1 items-center h-[calc(100vh-200px)]"
    >
      <div class="w-full">
        <div
          class="slider-shadow relative h-[400px] overflow-hidden w-full rounded"
        >
          <div class="absolute h-[400px] w-full rounded">
            <div
              v-if="files.length === 0"
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
              class="h-full"
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
                <div class="flex flex-col justify-center items-center h-full">
                  <label
                    @drop.prevent="(e) => handleDropChange(e, index)"
                    @dragover="handleDragOver"
                    class="text-center border-dashed border-blue-400 border-2 h-fit text-black bg-[#398fc83f] p-2"
                  >
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e) => handleChange(e, index)"
                      class="hidden"
                    />
                    <p>Upload change</p>
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
              <SwiperSlide v-if="files.length > 0 && files.length < 9">
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
        <div v-if="files.length > 0" class="w-full flex justify-center">
          <div
            class="border-2 border-t-0 border-blue-400 py-1 flex items-center w-fit gap-3 rounded-b justify-center px-4"
          >
            <div
              @click="goToSlide(index)"
              v-for="(item, index) in images"
              :style="{
                backgroundImage: 'url(' + item.img + ')',
              }"
              class="w-8 h-8 bg-center cursor-pointer bg-contain hover:scale-110 active:scale-125 bg-no-repeat"
            ></div>
          </div>
        </div>

        <div
          v-if="files.length > 0 && files.length < 9"
          @click="goToSlide(images.length + 1)"
          class="flex m-auto gap-3 capitalize bg-blue-400 text-white rounded-b w-fit p-2 py-1 cursor-pointer"
        >
          add more
          <ImageIcon />
        </div>
        <p class="text-center text-sm text-gray-500">
          *Remember! first image in the list will be shown on product card
        </p>
      </div>
      <div>
        <div
          class="flex text-xl items-center justify-between border-b-2 py-1 pb-2 border-black"
        >
          <h3>Poco F4 GT</h3>
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
            submit
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>
