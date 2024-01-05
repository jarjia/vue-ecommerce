<script setup lang="ts">
import { getCities, getCountries } from "@/services";
import { useMutation, useQuery } from "@tanstack/vue-query";
import { Ref, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { CountryItem } from "./types";
import { ErrorMessage } from "vee-validate";
import { useAuthData } from "@/store";
import router from "@/routes";
import { isTouchDevice } from "@/helpers";
import { DropDownIcon } from "@/components";

const { data, isLoading } = useQuery({
  queryKey: ["countries"],
  queryFn: getCountries,
});

const {
  mutate: getCitiesMutation,
  isSuccess,
  data: citiesData,
} = useMutation({ mutationFn: getCities });

let props = defineProps({
  isCheckout: {
    type: Boolean,
    default: true,
  },
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

onMounted(() => {
  if (router.currentRoute.value.name === "checkout") {
    getCitiesMutation(props.value);
  }
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
    obj && obj.focus();
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
  <div
    class="flex flex-col min-w-[350px] sm-mobile:min-w-[200px]"
    :class="isCheckout ? 'mt-0' : 'mt-3 sm:mt-0'"
  >
    <label v-if="isCheckout">Country of residence</label>
    <label
      v-else
      class="relative z-[2] transition-all"
      :class="value.length > 0 ? 'top-1 left-0' : 'top-[35px] left-2'"
      >{{
        value.length < 1 && searchDropDown.length > 0 && isTouchDevice()
          ? searchDropDown.toLowerCase()
          : props.label
      }}</label
    >
    <div
      @click="showDropDown = !showDropDown"
      class="flex justify-between items-center select-none cursor-default your-dropdown-container auth-autofill h-[36px] mt-1 bg-transparent z-[3] outline-none"
      :class="
        isCheckout
          ? 'border-[1px] border-[#e8e8e8] rounded-[5px] py-[26px] px-[20px]'
          : 'border-2 border-black py-1 px-2'
      "
    >
      <p>{{ value.length > 0 ? value : isCheckout ? "Choose Country" : "" }}</p>
      <DropDownIcon :isProduct="false" />
    </div>
    <div v-if="showDropDown" class="relative">
      <div
        class="absolute shadow-2xl z-[5] scrollbar w-full max-h-[200px] overflow-y-auto"
        :class="isCheckout ? 'bg-white' : 'bg-opacity-[0.91] bg-[#dbe7ff]'"
      >
        <p
          v-if="isLoading"
          class="your-dropdown-container text-center text-md py-1"
        >
          Loading...
        </p>
        <div
          v-else-if="data?.data && data?.data.length > 0"
          class="px-2 py-[2px] cursor-pointer hover:bg-blue-400 hover:text-white"
          v-for="residence in data?.data && data?.data.filter((item: CountryItem) =>
            item.country.toLowerCase().includes(searchDropDown.toLowerCase())
          )"
          :key="residence.id"
          @click="
            () => {
              setCountry(residence.country);
              if (residence.country !== value) {
                setCity('');
                getCitiesMutation(residence.country);
              }
            }
          "
        >
          {{ residence.country }}
        </div>
        <p v-else class="your-dropdown-container text-center text-md py-1">
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
