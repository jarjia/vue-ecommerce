<script setup lang="ts">
import { Ref, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { ErrorMessage } from "vee-validate";
import { useAuthData } from "@/store";
import { DropDownIcon } from "@/components";

const auth = useAuthData();

const searchDropDown_1: Ref<string> = ref("");
const showDropDown: Ref<boolean> = ref(false);
const cityRef = ref<null | HTMLDivElement>(null);
const perCities = ref(300);

let props = defineProps({
  isCheckout: {
    type: Boolean,
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

const handleScroll = () => {
  if (cityRef.value !== null) {
    const scrollTop = cityRef.value.scrollTop;
    const clientHeight = cityRef.value.clientHeight;
    const scrollHeight = cityRef.value.scrollHeight;

    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

    if (isAtBottom) perCities.value += perCities.value * 2;
  }
};

watch(cityRef, (newVal) => {
  if (newVal !== null) {
    newVal.addEventListener("scroll", handleScroll);
    if (!showDropDown.value) {
      newVal.removeEventListener("scroll", handleScroll);
    }
  }
});

onMounted(() => {
  document.addEventListener("click", close);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", close);
});
</script>

<template>
  <div
    class="flex flex-col min-w-[350px]"
    :class="isCheckout ? 'mt-0' : 'mt-3'"
  >
    <label v-if="isCheckout">City of residence</label>
    <label
      v-else
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
      class="flex justify-between items-center select-none cursor-default your-dropdown-container-1 h-[36px] auth-autofill mt-1 bg-transparent z-[3] outline-none"
      :class="
        isCheckout
          ? 'border-[1px] border-[#e8e8e8] rounded-[5px] py-[26px] px-[20px]'
          : 'border-2 border-black py-1 px-2'
      "
    >
      <p>
        {{
          value.length > 0
            ? value
            : isCheckout
            ? country.length > 0 && auth.$state.cities.length === 0
              ? "Loading..."
              : props.label
            : ""
        }}
      </p>
      <DropDownIcon :isProduct="false" />
    </div>
    <div v-if="showDropDown" class="relative">
      <div
        class="absolute z-[51] scrollbar shadow-2xl w-full max-h-[200px] overflow-y-auto"
        :class="isCheckout ? 'bg-white' : 'bg-opacity-[0.91] bg-[#dbe7ff]'"
        ref="cityRef"
      >
        <div
          v-if="auth.$state.cities.length > 0"
          class="px-2 py-[2px] cursor-pointer hover:bg-blue-400 hover:text-white"
          v-for="residence in auth.$state.cities.filter((item: string) =>
            item.toLowerCase().includes(searchDropDown_1.toLowerCase())
          ).slice(0, perCities)"
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
