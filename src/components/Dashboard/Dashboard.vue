<script setup lang="ts">
import { Layout, SharedProductList, Order } from "@/components";
</script>

<template>
  <Layout>
    <div class="grid grid-cols-[25%_75%]">
      <div
        class="bg-[#F5F5FA] m-2 rounded-xl p-2 max-h-screen min-h-screen shadow"
      >
        <h2 class="text-xl text-center p-4">Your Orders:</h2>
        <div class="overflow-y-scroll scrollbar h-[90%] flex flex-col gap-2">
          <Order />
          <Order />
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
