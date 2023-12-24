<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref } from "vue";
import { deleteCartItem, updateCartQuantity } from "@/services";
import { useAuthData } from "@/store";

const queryClient = useQueryClient();
const cart = useAuthData();

const props = defineProps({
  thumbnail: String,
  name: String,
  price: {
    type: String,
    default: true,
  },
  quantity: {
    type: Number,
    default: true,
  },
  maxQuantity: {
    type: Number,
    default: true,
  },
  cart_id: {
    type: Number,
    default: true,
  },
});

const isDeleting = ref(false);
const quantity = ref(props.quantity);

const { mutate: deleteCartItemMutation, isPending: deleteLoading } =
  useMutation({
    mutationFn: deleteCartItem,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
    },
  });

const { mutate: changeQuantityMutation } = useMutation({
  mutationFn: updateCartQuantity,
  onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
  },
});

let quantityTimeout: NodeJS.Timeout | null = null;

const handleQuantityIncrease = (definedNumber: number) => {
  if (quantity.value + 1 <= definedNumber) {
    quantity.value++;

    cart.setChangingCartPrice(parseFloat(props.price));

    if (props.quantity !== quantity.value) {
      if (quantityTimeout) {
        clearTimeout(quantityTimeout);
      }
      quantityTimeout = setTimeout(() => {
        changeQuantityMutation({
          quantity: quantity.value,
          cart_id: props.cart_id,
        });
      }, 500);
    }
  }
};

const handleQuantityDecrease = () => {
  if (quantity.value - 1 > 0) {
    quantity.value--;

    cart.setChangingCartPrice(-parseFloat(props.price));

    if (props.quantity !== quantity.value) {
      if (quantityTimeout) {
        clearTimeout(quantityTimeout);
      }
      quantityTimeout = setTimeout(() => {
        changeQuantityMutation({
          quantity: quantity.value,
          cart_id: props.cart_id,
        });
      }, 500);
    }
  }
};

const handleDelete = (cart_id: number) => {
  isDeleting.value = true;
  deleteCartItemMutation(cart_id);
  setTimeout(() => {
    isDeleting.value = false;
  }, 1000);
};
</script>

<template>
  <div class="w-full text-lg h-[409px] shadow-2xl rounded-xl">
    <div
      v-if="deleteLoading || isDeleting"
      class="flex items-center justify-center"
    >
      <img src="/gifs/loading.gif" />
    </div>
    <template v-else>
      <div
        class="w-full h-[70%] bg-contain bg-no-repeat bg-center"
        :style="{
          backgroundImage: 'url(' + thumbnail + ')',
        }"
      ></div>
      <div class="flex justify-between px-4">
        <h4>{{ name }}</h4>
        <p>${{ (parseFloat(price) * quantity).toFixed(2) }}</p>
      </div>
      <div class="flex items-center justify-between px-4 pt-6">
        <button
          @click="handleDelete(cart_id)"
          class="capitalize rounded py-2 text-white px-3 bg-red-400"
        >
          remove
        </button>
        <div class="grid grid-cols-[30px_30px_30px]">
          <button
            @click="handleQuantityDecrease"
            class="hover:bg-gray-100 rounded"
          >
            -
          </button>
          <p class="text-center">{{ quantity }}</p>
          <button
            @click="handleQuantityIncrease(maxQuantity)"
            class="hover:bg-gray-100 rounded"
          >
            +
          </button>
        </div>
      </div></template
    >
  </div>
</template>
