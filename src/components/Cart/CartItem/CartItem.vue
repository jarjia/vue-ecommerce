<script setup lang="ts">
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { ref, watch } from "vue";
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
  product_id: {
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

watch(quantity, (newVal) => {
  if (typeof newVal === "string") {
    quantity.value = 1;
  }
  if (newVal < 0) {
    quantity.value = 1;
  }
  if (newVal > props.maxQuantity) {
    quantity.value = props.maxQuantity;
  }
  if (typeof newVal !== "string") {
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
});

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
        :title="`view product: ${name}`"
        @click="$router.push(`/product-view/${product_id}`)"
        class="w-full h-[70%] cursor-pointer bg-contain bg-no-repeat bg-center"
        :style="{
          backgroundImage: 'url(' + thumbnail + ')',
        }"
      ></div>
      <div class="flex justify-between px-4">
        <h4 class="truncate max-w-4/5">
          {{ name }}
        </h4>
        <p>${{ (parseFloat(price) * quantity).toFixed(2) }}</p>
      </div>
      <div class="flex items-center justify-between px-4 pt-6">
        <button
          @click="handleDelete(cart_id)"
          class="capitalize rounded py-2 text-white px-3 bg-red-400"
        >
          remove
        </button>
        <div class="grid grid-cols-[30px_40px_30px]">
          <button
            @click="handleQuantityDecrease"
            class="hover:bg-gray-100 rounded"
          >
            -
          </button>
          <input
            type="number"
            id="no-number-btns"
            min="1"
            class="text-center w-auto outline-none"
            :max="maxQuantity"
            v-model="quantity"
            autocomplete="off"
          />
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
