<script setup lang="ts">
import { getCities, getCountries } from "@/services";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { Ref, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CountryItem } from "./types";
import { ErrorMessage } from "vee-validate";
import { useAuthData } from "@/store";
import { DropDownIcon } from "@/components";

const { data } = useQuery({
  queryKey: ["countries"],
  queryFn: getCountries,
});

const {
  mutate,
  isSuccess,
  data: citiesData,
} = useMutation({ mutationFn: getCities });

let props = defineProps({
  setCountry: {
    type: Function,
    default: true,
  },
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
});

watch(isSuccess, (newBool) => {
  if (newBool) {
    setCities(citiesData.value?.data.data);
  }
});

const { setCities } = useAuthData();

let searchDropDown = ref("");
let showDropDown: Ref<boolean> = ref(false);

const close = (e: MouseEvent) => {
  const targetElement = e.target as Element;

  if (!showDropDown.value) {
    searchDropDown.value = "";
  }

  if (!targetElement.closest(".your-dropdown-container")) {
    showDropDown.value = false;
    searchDropDown.value = "";
  } else {
    let obj = document.getElementById("search") as HTMLElement;
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
  <div class="flex flex-col mt-3 sm:mt-0 min-w-[350px]">
    <label
      class="relative z-[2] transition-all"
      :class="value.length > 0 ? 'top-1 left-0' : 'top-[35px] left-2'"
      >{{ props.label }}</label
    >
    <div
      @click="showDropDown = !showDropDown"
      class="flex px-2 justify-between items-center select-none cursor-default your-dropdown-container auth-autofill h-[36px] mt-1 bg-transparent border-2 z-[3] border-black outline-none py-1"
    >
      <p>{{ value.length > 0 ? value : "" }}</p>
      <DropDownIcon :isProduct="false" />
    </div>
    <div v-if="showDropDown" class="relative">
      <div
        class="absolute shadow-2xl z-[5] scrollbar bg-[#dbe7ff] bg-opacity-[0.91] w-full max-h-[200px] overflow-y-auto"
      >
        <div
          v-if="data?.data.length > 0"
          class="px-2 py-[2px] cursor-pointer hover:bg-blue-400 hover:text-white"
          v-for="residence in data?.data.filter((item: CountryItem) =>
            item.country.toLowerCase().includes(searchDropDown)
          )"
          :key="residence.id"
          @click="
            () => {
              setCountry(residence.country);
              if (residence.country !== value) {
                setCity('');
                mutate(residence.country);
              }
            }
          "
        >
          {{ residence.country }}
        </div>
        <p v-else class="your-dropdown-container text-center text-md pt-2">
          Countries could not be fetched.
        </p>
      </div>
    </div>
    <input
      id="search"
      type="text"
      v-model="searchDropDown"
      name="searchDropDown"
      class="absolute right-[400px] w-1 h-1 top-[-10px]"
    />
    <div class="relative">
      <ErrorMessage
        name="country"
        class="absolute text-red-500 font-sans text-sm"
      />
    </div>
  </div>
</template>
