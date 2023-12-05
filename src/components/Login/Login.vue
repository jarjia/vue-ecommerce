<script lang="ts" setup>
import { AuthLayout, Input, Spinner } from "@/components";
import { useForm } from "vee-validate";
import { logInSchema } from "@/schema";
import { useMutation } from "@tanstack/vue-query";
import { postLoginUser, postSendVerify, getCrsfToken } from "@/services";
import router from "@/routes";
import { onBeforeMount, ref } from "vue";

onBeforeMount(() => {
  getCsrfCookies();
});

const getCsrfCookies = async () => {
  try {
    await getCrsfToken();
  } catch (error) {
    console.log(error);
  }
};

const initialValues = {
  email: "",
  password: "",
};

const { handleSubmit, setFieldError, values } = useForm({
  validationSchema: logInSchema,
  initialValues,
});

const askVerification = ref(false);

const { mutate: sendVerifyMutation, isPending: verifiyPending } = useMutation({
  mutationFn: postSendVerify,
  onSettled() {
    askVerification.value = false;
  },
});

const { mutate: loginMutation, isPending } = useMutation({
  mutationFn: postLoginUser,
  onSuccess() {
    localStorage.setItem("auth", "yes");
    router.push("/product-list");
  },
  onError(error: any) {
    if (error?.response.status === 401) {
      setFieldError("email", error?.response.data);
      askVerification.value = true;
    }
  },
});

const onSubmit = handleSubmit((values) => {
  loginMutation(values);
});
</script>

<template>
  <div class="relative flex justify-center">
    <div
      class="absolute z-[10] min-w-[363px] transition-all duration-500 shadow-2xl mt-3 bg-blue-300 text-md p-4 rounded-2xl text-white"
      :class="askVerification ? 'top-0' : 'top-[-200px]'"
    >
      <div v-if="!verifiyPending">
        <p class="text-center">
          It seems like you have not verified your email.
        </p>
        <p class="text-center">Would you like us to send verfication mail?</p>
        <div class="flex justify-center gap-8 mt-2">
          <button
            class="italic"
            @click="
              () =>
                sendVerifyMutation({
                  email: values.email,
                })
            "
          >
            Yes
          </button>
          <button class="italic" @click="() => (askVerification = false)">
            No, thanks
          </button>
        </div>
      </div>
      <div v-else class="flex justify-center my-4">
        <Spinner />
      </div>
    </div>
  </div>

  <AuthLayout>
    <div>
      <h1 class="text-center text-3xl font-sans">Log in</h1>
      <p class="text-center text-md mt-3">
        Welcome back! provide credentials to access your account.
      </p>
      <div class="m-auto w-[30%] h-[1.5px] bg-black mt-3 rounded-2xl"></div>
      <form @submit="onSubmit" class="grid grid-cols-1 px-4 mt-6 gap-6">
        <div class="grid grid-cols-2 gap-8 sm:grid-cols-1 sm:gap-0">
          <Input type="email" name="email" label="Your Email" />
          <Input type="password" name="password" label="Your Password" />
        </div>
        <div>
          <button
            type="submit"
            :disabled="isPending"
            class="bg-blue-400 max-h-[36px] capitalize text-white w-full min-w-full py-[6px] rounded"
          >
            <Spinner v-if="isPending" />
            <span v-else>Log in</span>
          </button>
          <p class="text-sm pt-1 text-center w-full">
            Don't have an account?
            <router-link to="/auth" class="text-blue-500 underline"
              >Sign up</router-link
            >
          </p>
        </div>
      </form>
      <div class="flex justify-center w-full">
        <img src="/images/ecommerce-login.png" class="w-[450px] h-[250px]" />
      </div>
    </div>
  </AuthLayout>
</template>
