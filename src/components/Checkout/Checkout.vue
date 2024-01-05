<script setup lang="ts">
import {
  Layout,
  TriangleIcon,
  MessageIcon,
  Select,
  SelectForCity,
  CheckoutCartItem,
} from "@/components";
import { checkout } from "@/services";
import { onMounted, ref, watch } from "vue";
import { loadStripe } from "@stripe/stripe-js";
import { style, countryCodes } from "@/helpers";
import { ErrorMessage } from "vee-validate";
import { numberWithCommas } from "@/helpers";
import useCheckout from "./useCheckout";

const stripe = ref<null | any>(null);
const cardNumber = ref<null | any>(null);
const isPaying = ref(false);
const cardElement = ref(null);
const isMounted = ref(false);
const status = ref<null | string>(null);
const showMessage = ref(false);
const cardError = ref<null | string>(null);

const {
  address,
  city,
  country,
  setCountry,
  setCity,
  data,
  checkoutProductsMutation,
  handleSubmit,
  showPaymentStatus,
  auth,
} = useCheckout();

const setupStripe = async () => {
  const stripeLoaded = await loadStripe(import.meta.env.VITE_STRIPE_PK);

  stripe.value = stripeLoaded;

  if (stripeLoaded) {
    const card = stripeLoaded.elements().create("card", {
      style,
      classes: {
        base: "form-control w-full",
        complete: "is-valid",
        empty: "is-empty",
        invalid: "is-invalid",
        webkitAutofill: "form-fill",
      },
    });

    cardNumber.value = card;

    isMounted.value = true;
  }
};

onMounted(() => {
  setupStripe();
  setTimeout(() => {
    showMessage.value = true;
  }, 1000);
  setTimeout(() => {
    showMessage.value = false;
  }, 5000);
});

watch([cardElement, isMounted], ([cardVal, isMountedVal]) => {
  if (cardVal && isMountedVal) {
    cardNumber.value.mount("#card-element");
  }
});

const onSubmit = handleSubmit(async (values) => {
  cardError.value = null;
  showPaymentStatus.value = "pending";
  const countryForPayment = countryCodes.find(
    (country) => country.name.toLowerCase() === values.country.toLowerCase()
  );

  isPaying.value = true;
  status.value = "getting client secret token...";
  const clientSecret = (
    await checkout(data.value?.data.total_with_shipping_cost)
  ).data.clientSecret;

  try {
    status.value = "sending payment request...";
    const { paymentMethod, error } = await stripe.value.createPaymentMethod({
      type: "card",
      card: cardNumber.value,
      billing_details: {
        name: auth.$state.userData?.name,
        email: auth.$state.userData?.email,
        address: {
          country: countryForPayment?.code,
          city: values.city,
          line1: values.address,
        },
      },
    });

    console.log(error, paymentMethod);

    if (!error) {
      status.value = "confirming payment";
      const res = await stripe.value.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber.value,
        },
      });
      console.log(res);

      if (res.paymentIntent.status === "succeeded") {
        checkoutProductsMutation();
        showPaymentStatus.value = "success";
        status.value = "payment successful!";
      }
      isPaying.value = false;
    } else {
      showPaymentStatus.value = "error";
      cardError.value = error.message;
      status.value = "payment failed!";
    }
  } catch (error) {
    console.log(error);
    showPaymentStatus.value = "error";
    cardError.value = "Initializing payment failed";
    isPaying.value = false;
    status.value = "payment failed!";
  }
});
</script>

<template>
  <Layout>
    <div
      v-if="showPaymentStatus !== null"
      class="fixed bg-[#0000004f] w-full top-0 flex justify-center items-center h-screen z-[99]"
    >
      <div
        class="bg-white grid grid-rows-[70%_30%] mobile:grid-rows-[60%_40%] avg-desk-for-view:h-1/2 mobile:h-1/3 items-center justify-center flex-col shadow-2xl w-1/2 h-4/6 rounded"
      >
        <img
          v-if="showPaymentStatus === 'pending'"
          src="/gifs/loading.gif"
          class="h-full"
        />
        <img
          v-else-if="showPaymentStatus === 'error'"
          src="/images/error.png"
          class="h-[80%]"
        />
        <img
          v-if="showPaymentStatus === 'success'"
          src="/images/success.png"
          class="h-[80%]"
        />
        <div class="flex flex-col">
          <p class="text-xl text-center">{{ cardError }}</p>
          <p class="text-xl text-center">{{ status }}</p>
          <button
            v-if="showPaymentStatus === 'error'"
            class="p-1 text-center bg-red-400 mt-2 rounded text-white"
            @click="
              () => {
                showPaymentStatus = null;
                cardError = null;
                status = null;
              }
            "
          >
            close
          </button>
        </div>
      </div>
    </div>
    <div
      id="checkout"
      class="grid grid-cols-2 gap-8 px-10 avg-desk-for-view:px-2 avg-desk-for-view:gap-4 sm:grid-cols-1"
    >
      <div>
        <form
          @submit.prevent="onSubmit"
          class="flex flex-col gap-5"
          id="payment-form"
        >
          <Select
            :isCheckout="true"
            :setCity="auth.setCities"
            :setCountry="setCountry"
            :value="(country as string)"
            label="Country of residence"
          />
          <input
            type="hidden"
            name="country"
            readonly="true"
            v-model="country"
          />
          <SelectForCity
            :isCheckout="true"
            :value="(city as string)"
            label="City of residence"
            :setCity="setCity"
            :country="(country as string)"
          />
          <input type="hidden" name="country" readonly="true" v-model="city" />
          <div class="flex flex-col">
            <label>Address</label>
            <input
              type="text"
              name="address"
              v-model="address"
              class="border-[1px] border-[#e8e8e8] rounded-[5px] py-[15px] px-[20px]"
            />
            <div class="relative">
              <ErrorMessage
                name="address"
                class="absolute text-red-500 font-sans text-sm"
              />
            </div>
          </div>
          <div>
            <div class="grid grid-cols-[50%_50%] sm:flex sm:gap-2">
              <label>Card information</label>
              <div class="flex flex-col justify-self-end">
                <span
                  @mouseenter="showMessage = true"
                  @mouseleave="showMessage = false"
                  ><MessageIcon />
                </span>
                <div
                  @mouseenter="showMessage = true"
                  @mouseleave="showMessage = false"
                  :class="
                    showMessage
                      ? 'opacity-1 pointer-events-auto'
                      : 'opacity-0 pointer-events-none'
                  "
                  class="transition-opacity relative right-[135px] bottom-1 z-[50]"
                >
                  <div class="absolute flex flex-col items-center">
                    <TriangleIcon />
                    <div
                      class="w-[300px] sm-mobile:w-[200px] relative bottom-[5px] p-3 leading-6 rounded-lg bg-white shadow-2xl text-sm text-black"
                    >
                      *Since this is a testing payment system please input
                      testing card number "4242 4242 4242 4242" fill other
                      fields as you want to.
                      <a
                        href="https://stripe.com/docs/testing#cards"
                        target="_blank"
                        class="text-blue-400"
                        >See other test card numbers</a
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div ref="cardElement" id="card-element"></div>
            <div class="relative pb-1">
              <p
                class="absolute text-red-500 font-sans text-sm"
                v-if="cardError"
              >
                {{ cardError }}
              </p>
            </div>
          </div>
          <button
            type="submit"
            class="bg-blue-400 text-white active:bg-blue-600 hover:bg-blue-500 rounded py-2 capitalize"
          >
            pay (${{ numberWithCommas(data?.data.total_with_shipping_cost) }})
          </button>
        </form>
      </div>
      <div class="max-h-[calc(100vh-150px)] p-2 overflow-y-scroll scrollbar">
        <p class="w-full text-right py-1">
          Shipping cost:
          <span class="text-blue-400">${{ 20 }}</span>
        </p>
        <p class="w-full text-right py-1">
          Product cost:
          <span class="text-blue-400"
            >${{ numberWithCommas(data?.data.total) }}</span
          >
        </p>
        <p class="w-full text-right text-2xl border-b-[1px] border-black">
          Total:
          <span class="text-blue-400"
            >${{ numberWithCommas(data?.data.total_with_shipping_cost) }}</span
          >
        </p>

        <CheckoutCartItem
          v-for="cart in data?.data.main_data"
          :name="cart.product_name"
          :price="cart.product_price"
          :description="cart.product_desc"
          :type="cart.product_type"
          :quantity="cart.quantity"
        />
      </div>
    </div>
  </Layout>
</template>

<style>
.form-control {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 5px !important;
  padding: 18px 20px;
  font-size: 14px;
}
.form-fill {
  background-color: transparent !important;
  color: black !important;
  -webkit-text-fill-color: black !important;
}
</style>
