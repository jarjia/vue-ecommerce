<script setup lang="ts">
import { Layout, CartHeader, CartItem } from "@/components";
import useCart from "./useCart";

const { data, isLoading, isPending, isDeleting, handleEmptyCart } = useCart();
</script>

<template>
  <Layout>
    <div class="mx-8">
      <CartHeader
        :quantity="data?.data.main_data.length"
        :onDeleteCartItemsMutation="handleEmptyCart"
      />
      <div
        v-if="isLoading || isPending || isDeleting"
        class="flex items-center justify-center"
      >
        <img src="/gifs/loading.gif" />
      </div>
      <div
        v-else-if="!isLoading && data?.data.main_data.length > 0"
        class="grid grid-cols-3 gap-4 my-4 avg-desk-for-view:grid-cols-2 mobile:grid-cols-1"
      >
        <CartItem
          v-for="item in data?.data.main_data"
          :thumbnail="item.mainImage"
          :name="item.product_name"
          :price="item.product_price"
          :quantity="item.quantity"
          :maxQuantity="item.product_quantity"
          :cart_id="item.id"
          :product_id="item.product_id"
        />
      </div>
      <div v-else class="m-auto text-center py-20 text-2xl">
        <p>No products in the cart...</p>
      </div>
    </div>
  </Layout>
</template>
