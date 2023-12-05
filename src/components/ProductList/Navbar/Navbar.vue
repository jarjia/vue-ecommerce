<script setup lang="ts">
import { BurgerIcon, Cart } from "@/components";

// const { mutate: logOutMutation } = useMutation({
//   mutationFn: logOutUser,
//   onSuccess() {
//     localStorage.removeItem("auth");
//     router.push("/login");
//   },
// });
</script>

<template>
  <nav
    class="grid grid-cols-3 sm:grid-cols-2 w-screen fixed z-[99] bg-white shadow p-4 px-8"
  >
    <div
      class="flex items-center gap-2 cursor-pointer w-fit"
      @click="() => $router.push('/product-list')"
    >
      <img src="/images/logo.png" alt="logo" class="w-9 h-9" />
      <p class="text-lg">Your Ecommerce</p>
    </div>
    <div class="flex items-center justify-center gap-6 sm:hidden">
      <RouterLink to="/profile" class="capitalize">profile</RouterLink>
      <RouterLink to="/about-us" class="capitalize">about</RouterLink>
      <RouterLink to="/contact-us" class="capitalize">contact</RouterLink>
    </div>
    <div class="flex items-center justify-end gap-3">
      <button class="hover:bg-gray-100 p-2 rounded-full">
        <div class="relative bottom-2 left-4">
          <div
            class="bg-red-500 py-[2px] select-none px-[8px] text-sm text-white rounded-full absolute"
          >
            3
          </div>
        </div>
        <Cart />
      </button>
      <button class="sm:block hidden">
        <BurgerIcon />
      </button>
    </div>
  </nav>
</template>
