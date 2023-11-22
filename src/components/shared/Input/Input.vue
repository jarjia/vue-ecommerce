<script setup lang="ts">
import { ref } from "vue";
import { ErrorMessage, useField } from "vee-validate";

let props = defineProps({
  label: {
    type: String,
    default: true,
  },
  modelValue: {
    type: String,
  },
  name: {
    type: String,
    default: true,
  },
  type: {
    type: String,
  },
});

const { value } = useField(() => props.name);

let focus = ref(props.modelValue && props.modelValue.length > 0 ? true : false);
</script>

<template>
  <div class="flex flex-col mt-3 min-w-[350px]">
    <label
      :for="name"
      class="relative z-[2] transition-all"
      :class="focus ? 'top-1 left-0' : 'top-[35px] left-2'"
      >{{ label }}</label
    >
    <input
      v-model="value"
      :name="name"
      :id="name"
      :type="type"
      @focus="focus = true"
      @blur="(value as string).length > 0 ? (focus = true) : (focus = false)"
      class="auth-autofill mt-1 bg-transparent border-2 z-[3] font-sans border-black outline-none py-1 px-1"
    />
    <div class="relative">
      <ErrorMessage
        :name="name"
        class="absolute text-red-500 font-sans text-sm"
      />
    </div>
  </div>
</template>
