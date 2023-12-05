<script setup lang="ts">
import router from "@/routes";
import { getProducts } from "@/services";
import { sorts } from "@/helpers";
import { useQuery } from "@tanstack/vue-query";
import {
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from "vue";
import { Product, Search, DropDownIcon, PlusIcon } from "@/components";

defineProps({
  isProfile: Boolean,
});

const { data, isLoading } = useQuery({
  queryKey: ["products"],
  queryFn: getProducts,
});

onBeforeMount(() => {
  let auth = localStorage.getItem("auth");
  if (auth === null) {
    router.push("/login");
  }
});

const scrollPosition = reactive({
  y: 0,
});

const isSort = ref(false);
const search = ref("");

const sort = ref(
  router.currentRoute.value.query.sort
    ? router.currentRoute.value.query.sort
    : sorts[0]
);

const updateScrollPosition = () => {
  scrollPosition.y = window.scrollY;
};

const close = (e: MouseEvent) => {
  const targetElement = e.target as Element;

  if (!targetElement.closest(".sort-drop")) {
    isSort.value = false;
  } else {
    let obj = document.getElementById("search") as HTMLElement;
    obj.focus();
  }
};

const changeSort = (sortItem: string) => {
  isSort.value = false;
  sort.value = sortItem;
  if (sortItem !== "All products") {
    router.push({
      query: { ...router.currentRoute.value.query, sort: sortItem },
    });
  } else {
    if (router.currentRoute.value.query.sort) router.push("/product-list");
  }
};

onMounted(() => {
  document.addEventListener("click", close);
  window.addEventListener("scroll", updateScrollPosition);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", close);
});

onUnmounted(() => {
  window.removeEventListener("scroll", updateScrollPosition);
});
</script>

<template>
  <div
    class="border-b-[1px] border-black pb-4"
    :class="isProfile ? 'mx-1' : 'mx-16 mini-desk:mx-8 '"
  >
    <div
      class="flex justify-between gap-6"
      :class="isProfile ? 'mini-desk:flex-col' : 'mobile:flex-col'"
    >
      <div class="flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          v-model="search"
          v-on:keyup.enter="
            () => {
              if (search.length > 0)
                router.push({
                  query: {
                    ...router.currentRoute.value.query,
                    search: search,
                  },
                });
            }
          "
          class="border-[1px] select-none rounded-full placeholder:text-black pl-2 pr-8 py-[6px] w-80 border-black outline-none"
          :class="isProfile ? 'mini-desk:w-full' : 'mobile:w-full'"
        />
        <div class="relative bottom-3 right-[32px]">
          <Search class="absolute" />
        </div>
      </div>
      <div class="flex flex-col justify-center">
        <button
          class="bg-gray-100 rounded-full sort-drop p-2 grid items-center grid-cols-[85%_15%] gap-3"
          :class="
            isProfile
              ? 'mini-desk:grid-cols-[92%_8%]'
              : 'mobile:grid-cols-[92%_8%]'
          "
          @click="isSort = !isSort"
        >
          <p
            class="truncate w-[150px] text-sm select-none"
            :class="
              isProfile
                ? 'mini-desk:w-full mini-desk:flex'
                : 'mobile:w-full mobile:flex'
            "
          >
            Sort By: {{ sort }}
          </p>
          <DropDownIcon :isProduct="false" />
        </button>
        <div v-if="isSort" class="relative top-1 sort-drop z-[10]">
          <ul class="bg-gray-100 shadow-xl rounded-xl py-2 w-full absolute">
            <li
              v-for="item in sorts"
              @click="() => changeSort(item)"
              class="py-1 cursor-pointer px-2 hover:text-white hover:bg-blue-300"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div
    class="py-4"
    v-if="data?.data.length > 0"
    :class="
      isProfile
        ? 'grid grid-cols-3 mini-desk:grid-cols-1 medium-desk:grid-cols-2 auto-cols-auto gap-2 px-1 justify-center'
        : 'grid grid-cols-4 gap-10 px-16 av-desk:grid-cols-3 mini-desk:grid-cols-2 mobile:grid-cols-1 mini-desk:px-8'
    "
  >
    <div
      v-if="isProfile"
      title="Add product"
      @click="router.push('/product/create')"
      class="h-[250px] flex cursor-pointer active:shadow-none active:translate-x-[-2px] active:translate-y-[2px] justify-center items-center shadow-xl rounded-xl"
    >
      <PlusIcon :isViewer="false" />
    </div>
    <Product
      v-for="item in data?.data"
      :key="item.id"
      :id="item.id"
      :name="item.name"
      :price="item.price"
      :mainImage="item.mainImage"
      :isInStock="item.isInStock"
    />
  </div>
  <div v-else-if="isLoading" class="flex items-center justify-center">
    <img src="/gifs/loading.gif" />
  </div>
  <div v-else>
    <div v-if="isProfile" class="flex items-center mini-desk:flex-col">
      <img
        src="/images/no-product-profile.webp"
        class="w-2/5 h-2/5 mini-desk:w-[250px] mini-desk:h-[200px]"
      />
      <div class="text-center py-20 mini-desk:py-4 mini-desk:text-center">
        <h3 class="text-3xl">Your products could not be found...</h3>
        <button
          @click="router.push('product/create')"
          class="capitalize mt-2 bg-blue-400 text-white p-2 rounded"
        >
          create one!
        </button>
      </div>
    </div>
    <div v-else class="flex items-center ml-10 sm:flex-col sm:ml-0">
      <img
        src="/images/no-product.webp"
        class="w-2/5 h-2/5 sm:w-[250px] sm:h-[200px]"
      />
      <div class="py-20 sm:py-4 sm:text-center">
        <h3 class="text-3xl">No products found...</h3>
        <p class="text-md mt-4">
          You can add your products from the
          <RouterLink to="profile" class="text-blue-400">Profile!</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
