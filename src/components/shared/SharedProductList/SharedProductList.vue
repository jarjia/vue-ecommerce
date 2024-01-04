<script setup lang="ts">
import useSharedProducts from "./useSharedProducts";
import {
  Product,
  PlusIcon,
  DropDownIcon,
  SearchIcon,
  XIcon,
} from "@/components";

defineProps({
  isProfile: Boolean,
});

const {
  search,
  data,
  isLoading,
  isRefetching,
  sort,
  isSort,
  page,
  sorts,
  router,
  isFetchingNextPage,
  isFetchingPreviousPage,
  paginating,
  handleCustomPage,
  handleNext,
  changeSort,
  handleSearch,
  handlePrev,
} = useSharedProducts();
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
          v-on:keyup.enter="handleSearch"
          class="border-[1px] select-none rounded-full placeholder:text-black pl-2 pr-8 py-[6px] w-80 border-black outline-none"
          :class="isProfile ? 'mini-desk:w-full' : 'mobile:w-full'"
        />
        <div class="relative bottom-3 right-[32px]">
          <SearchIcon class="absolute" />
        </div>
        <button
          v-if="search.length > 0 && $router.currentRoute.value.query.search"
          @click="
            () => {
              search = '';
              handleSearch();
            }
          "
          title="clear search"
          class="mx-2 text-xl"
        >
          <XIcon />
        </button>
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
            class="truncate capitalize w-[150px] text-sm select-none"
            :class="
              isProfile
                ? 'mini-desk:w-full mini-desk:flex'
                : 'mobile:w-full mobile:flex'
            "
          >
            sort by: {{ sort }}
          </p>
          <DropDownIcon :isProduct="false" />
        </button>
        <div v-if="isSort" class="relative top-1 sort-drop z-[10]">
          <ul class="bg-gray-100 shadow-xl rounded-xl py-2 w-full absolute">
            <li
              v-for="item in sorts"
              @click="() => changeSort(item)"
              class="py-1 cursor-pointer px-2 capitalize hover:text-white hover:bg-blue-300"
            >
              {{ item }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <div
    v-if="isLoading || isFetchingNextPage || isFetchingPreviousPage"
    class="flex items-center justify-center"
  >
    <img src="/gifs/loading.gif" />
  </div>
  <template
    v-else-if="
      data?.pages[data.pageParams.indexOf(page)]?.data.products.length > 0
    "
  >
    <div
      class="py-4"
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
        class="h-[250px] sm-mobile:h-[250px] avg-desk-for-view:h-[350px] flex cursor-pointer active:shadow-none active:translate-x-[-2px] active:translate-y-[2px] justify-center items-center shadow-xl rounded-xl"
      >
        <PlusIcon :isViewer="false" />
      </div>
      <Product
        v-for="item in data?.pages[data.pageParams.indexOf(page)].data.products"
        :key="item.id"
        :id="item.id"
        :name="item.name"
        :price="item.price"
        :mainImage="item.mainImage"
        :thumbnails="item.thumbnails"
        :isInStock="item.isInStock"
      />
    </div>
    <div class="flex justify-center gap-2 my-4">
      <button
        :disabled="
          (paginating && isRefetching) ||
          isLoading ||
          paginating ||
          !page ||
          page === 1
        "
        @click="handlePrev"
        class="capitalize rotate-90 paginate"
      >
        <DropDownIcon :isProduct="false" />
      </button>
      <div>
        <button
          :disabled="
            paginating ||
            isRefetching ||
            isLoading ||
            pageItem === page ||
            (!page && pageItem === 1)
          "
          class="border-r-[1px] pagination px-2 border-gray-400"
          v-for="pageItem in Array.from(
            {
              length: data?.pages[data.pageParams.indexOf(page)].data.all_pages,
            },
            (_, index) => index + 1
          )"
          @click="handleCustomPage(pageItem)"
          :style="{
            color:
              pageItem === page || (!page && pageItem === 1) ? 'gray' : 'black',
          }"
        >
          {{ pageItem }}
        </button>
      </div>
      <button
        :disabled="
          paginating ||
          (paginating && isRefetching) ||
          isLoading ||
          page === data?.pages[data.pageParams.indexOf(page)].data.all_pages ||
          (data?.pages[data.pageParams.indexOf(page)].data.all_pages === 1 &&
            page === null)
        "
        @click="handleNext"
        class="capitalize rotate-[270deg] paginate"
      >
        <DropDownIcon :isProduct="false" />
      </button>
    </div>
  </template>
  <div
    v-if="data?.pages[data.pageParams.indexOf(page)]?.data.products.length < 1"
  >
    <div v-if="isProfile" class="flex items-center mini-desk:flex-col">
      <img
        src="/images/no-product-profile.webp"
        class="w-2/5 h-2/5 mini-desk:w-[250px] mini-desk:h-[200px]"
      />
      <div class="text-center py-20 mini-desk:py-4 mini-desk:text-center">
        <h3 class="text-3xl">Your products could not be found...</h3>
        <button
          @click="router.push('/product/create')"
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
        <p
          v-if="!$router.currentRoute.value.query.p || page === 1"
          class="text-md mt-4"
        >
          You can add your products from the
          <RouterLink to="/dashboard" class="text-blue-400"
            >dashboard!</RouterLink
          >
        </p>
        <p class="text-md mt-4" v-else>Page does not exist</p>
      </div>
    </div>
  </div>
</template>
