<script setup lang="ts">
import { BurgerIcon, CartIcon } from "@/components";
import { useAuthData } from "@/store";
import { useQuery } from "@tanstack/vue-query";
import { getCartCount } from "@/services";
import router from "@/routes";

const cart = useAuthData();

const { data } = useQuery({
  queryKey: ["cart-count"],
  queryFn: getCartCount,
});
</script>

<template>
  <nav
    class="grid grid-cols-3 sm:grid-cols-2 w-screen fixed z-[99] bg-white shadow p-4 px-8"
  >
    <div
      class="flex items-center gap-2 cursor-pointer w-fit"
      @click="
        () =>
          router.push({
            path: '/product-list',
            query:
              router.currentRoute.value.name === 'product-list'
                ? { ...router.currentRoute.value.query }
                : {},
          })
      "
    >
      <img src="/images/logo.png" alt="logo" class="w-9 h-9" />
      <p class="text-lg mobile:hidden block">Your Ecommerce</p>
    </div>
    <div class="flex items-center justify-center gap-6 sm:hidden">
      <RouterLink to="/dashboard" class="capitalize">dashboard</RouterLink>
      <RouterLink to="/about-us" class="capitalize">about</RouterLink>
      <RouterLink to="/contact-us" class="capitalize">contact</RouterLink>
    </div>
    <div class="flex items-center justify-end gap-3">
      <button
        @click="$router.push('/cart')"
        class="hover:bg-gray-100 p-2 rounded-full"
      >
        <div class="relative bottom-2 left-4">
          <div
            :class="data?.data > 0 ? 'py-[2px]' : 'py-0'"
            class="bg-red-500 select-none px-[8px] text-sm text-white rounded-full absolute"
          >
            {{ 2 > 99 ? "99+" : data?.data === 0 ? "" : data?.data }}
          </div>
        </div>
        <CartIcon />
      </button>
      <button @click="cart.setSideBar(true)" class="sm:block hidden">
        <BurgerIcon />
      </button>
    </div>
  </nav>
</template>
