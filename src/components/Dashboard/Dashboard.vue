<script setup lang="ts">
import { Layout, SharedProductList, Order, ArrowIcon } from "@/components";
import { getOrders } from "@/services";
import { useQuery } from "@tanstack/vue-query";
import { ref } from "vue";

const { data, isLoading } = useQuery({
  queryKey: ["orders"],
  queryFn: getOrders,
});

const isOrder = ref(false);
</script>

<template>
  <Layout>
    <div
      v-if="data?.data.length > 0"
      :class="isOrder ? 'translate-x-0' : 'translate-x-[calc(100%-141px)]'"
      class="avg-desk-for-view:flex items-start hidden w-5/12 mobile:w-4/5 max-h-4/5 fixed transition-transform right-0 z-[50]"
    >
      <button
        @click="isOrder = !isOrder"
        class="avg-desk-for-view:flex hidden capitalize left-[1px] bg-gray-100 relative items-center justify-between text-black p-4 py-3 rounded-l-full shadow-2xl"
      >
        <div :class="isOrder ? 'rotate-0' : 'rotate-180'">
          <ArrowIcon :isCheckout="false" />
        </div>
        <template v-if="!isOrder">
          <p>your</p>
          <p class="pl-1">orders</p>
        </template>
      </button>
      <div
        class="flex flex-col gap-2 overflow-y-scroll scrollbar max-h-[calc(100vh-150px)] bg-[#F5F5FA] w-full h-full rounded-l-xl rounded-tl-none p-2"
      >
        <Order
          v-if="data?.data.length > 0"
          v-for="order in data?.data"
          :arrives_at="order.arrives_at"
          :created_at="order.created_at"
          :name="order.name"
          :price="order.price"
          :mainImage="order.mainImage"
          :id="order.id"
        />
        <p v-else class="text-center py-8">No orders for now...</p>
      </div>
    </div>
    <div
      class="grid grid-cols-[25%_75%] avg-desk-for-view:grid-cols-1 avg-desk-for-view:px-10 sm-mobile:px-1"
    >
      <div class="relative avg-desk-for-view:hidden block">
        <div
          class="bg-[#F5F5FA] w-[24%] fixed m-2 rounded-xl overflow-y-scroll scrollbar p-2 max-h-[calc(100vh-120px)] min-h-[calc(100vh-120px)] shadow"
        >
          <h2
            class="text-xl text-center p-4 capitalize sticky top-[-10px] bg-[#F5F5FA]"
          >
            your orders
          </h2>
          <div class="scrollbar flex flex-col gap-2">
            <div v-if="isLoading" class="flex items-center justify-center">
              <img src="/gifs/loading.gif" />
            </div>
            <Order
              v-else-if="data?.data.length > 0"
              v-for="order in data?.data"
              :key="order.id"
              :arrives_at="order.arrives_at"
              :created_at="order.created_at"
              :name="order.name"
              :price="order.price"
              :id="order.id"
              :mainImage="order.mainImage"
            />

            <p v-else class="text-center">No orders for now...</p>
          </div>
        </div>
      </div>
      <div>
        <div class="flex justify-between items-center mb-2 px-2">
          <h2 class="text-2xl">Your Products</h2>
        </div>
        <SharedProductList :isProfile="true" />
      </div>
    </div>
  </Layout>
</template>
