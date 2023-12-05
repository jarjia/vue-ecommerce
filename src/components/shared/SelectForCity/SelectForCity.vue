<script setup lang="ts">
import { Ref, onBeforeUnmount, onMounted, ref } from "vue";
import { ErrorMessage } from "vee-validate";
import { useAuthData } from "@/store";
import { DropDownIcon } from "@/components";

const auth = useAuthData();

let searchDropDown_1: Ref<string> = ref("");
let showDropDown: Ref<boolean> = ref(false);
let justRef: any = ref();

let props = defineProps({
  setCity: {
    type: Function,
    default: true,
  },
  modelValue: {
    type: String,
  },
  label: {
    type: String,
    default: true,
  },
  value: {
    type: String,
    default: true,
  },
  country: {
    type: String,
    default: true,
  },
});

const close = (e: MouseEvent) => {
  const targetElement = e.target as Element;

  if (!showDropDown.value) {
    searchDropDown_1.value = "";
  }

  if (!targetElement.closest(".your-dropdown-container-1")) {
    showDropDown.value = false;
    searchDropDown_1.value = "";
  } else {
    let obj = document.getElementById("search_city") as HTMLElement;
    obj.focus();
  }
};

onMounted(() => {
  document.addEventListener("click", close);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", close);
});
</script>

<template>
  <div class="flex flex-col mt-3 min-w-[350px]">
    <label
      class="relative z-[2] transition-all"
      :class="value.length > 0 ? 'top-1 left-0' : 'top-[35px] left-2'"
      >{{
        country.length > 0 && auth.$state.cities.length === 0
          ? "Loading..."
          : props.label
      }}</label
    >
    <div
      @click="
        showDropDown =
          country.length > 0 && auth.$state.cities.length === 0
            ? false
            : !showDropDown
      "
      class="flex px-2 justify-between items-center select-none cursor-default your-dropdown-container-1 h-[36px] auth-autofill mt-1 bg-transparent border-2 z-[3] border-black outline-none py-1"
    >
      <p>{{ value.length > 0 ? value : "" }}</p>
      <DropDownIcon :isProduct="false" />
    </div>
    <div v-if="showDropDown" class="relative">
      <div
        class="absolute z-[5] scrollbar bg-[#dbe7ff] bg-opacity-[0.91] w-full max-h-[200px] overflow-y-auto"
        ref="justRef"
      >
        <div
          v-if="auth.$state.cities.length > 0"
          class="px-2 py-[2px] cursor-pointer hover:bg-blue-400 hover:text-white"
          v-for="residence in auth.$state.cities.filter((item: string) =>
            item.toLowerCase().includes(searchDropDown_1.toLowerCase())
          )"
          @click="() => setCity(residence)"
        >
          {{ residence }}
        </div>
        <div
          v-else-if="auth.$state.cities.length === 0 && country.length === 0"
          class="your-dropdown-container text-center text-md pt-2"
        >
          Please choose country of residence first.
        </div>
      </div>
    </div>
    <div class="relative">
      <ErrorMessage
        name="city"
        class="absolute text-red-500 font-sans text-sm"
      />
    </div>
    <input
      id="search_city"
      type="text"
      v-model="searchDropDown_1"
      name="searchDropDown_1"
      class="absolute right-[400px] w-1 h-1 top-[-10px]"
    />
  </div>
</template>
