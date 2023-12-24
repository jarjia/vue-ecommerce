<script setup lang="ts">
import { useAuthData } from "@/store";

const sideBar = useAuthData();
</script>

<template>
  <div
    v-if="sideBar.sideBar"
    @click="sideBar.setSideBar(false)"
    class="absolute z-[998] w-screen h-screen bg-[#00000046] sm:block hidden"
  ></div>
  <aside
    class="fixed py-4 shadow-xl h-screen w-4/5 transition-all z-[999] bg-white sm:block hidden"
    :class="sideBar.sideBar ? 'translate-x-0' : 'translate-x-[-100%]'"
  >
    <img src="/images/logo.png" alt="logo" class="m-auto w-[150px] h-[150px]" />
    <div class="flex flex-col items-center justify-center gap-6 p-10">
      <router-link
        @click="sideBar.setSideBar(false)"
        to="/dashboard"
        class="capitalize border-b-[1px] border-black"
        >dashboard</router-link
      >
      <router-link
        @click="sideBar.setSideBar(false)"
        to="/cart"
        class="capitalize border-b-[1px] border-black"
        >cart</router-link
      >
      <router-link
        @click="sideBar.setSideBar(false)"
        to="/about-us"
        class="capitalize border-b-[1px] border-black"
        >about</router-link
      >
      <router-link
        @click="sideBar.setSideBar(false)"
        to="/contact-us"
        class="capitalize border-b-[1px] border-black"
        >contact</router-link
      >
    </div>
  </aside>
</template>
