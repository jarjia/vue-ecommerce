<script setup lang="ts">
import {
  Input,
  Select,
  SelectForCity,
  AuthLayout,
  EmailVeficationSent,
  Spinner,
  EmailVerified,
  Expired,
} from "@/components";
import { useField, useForm } from "vee-validate";
import { registrationSchema } from "@/schema";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { createUser, postVerify } from "@/services";
import { useAuthData } from "@/store";
import { onMounted, ref, watch } from "vue";
import router from "@/routes";

const initialValues = {
  fullName: "",
  email: "",
  password: "",
  c_password: "",
  country: "",
  city: "",
  address: "",
};

let status = ref(sessionStorage.getItem("status"));

const { setCities } = useAuthData();

const { handleSubmit, setFieldValue, setFieldError, resetForm } = useForm({
  validationSchema: registrationSchema,
  initialValues,
});

const queryClient = useQueryClient();

const { mutate: registerMutation, isPending } = useMutation({
  mutationFn: createUser,
  mutationKey: ["cities"],
  onError(err: any) {
    if (err?.response.status === 403)
      setFieldError("email", err?.response?.data);
  },
  onSuccess() {
    status.value = "email-sent";
    sessionStorage.setItem("status", "email-sent");
    resetForm();
    setCities([]);
  },
});

const { mutate: verifyMutation } = useMutation({
  mutationFn: postVerify,
  onSuccess() {
    status.value = "verified";
    sessionStorage.setItem("status", "verified");
  },
  onError(err: any) {
    if (err?.response.status === 401) {
      status.value = "expired";
      sessionStorage.setItem("status", "expired");
    }
  },
});

const { value: country } = useField("country");
const { value: city } = useField("city");

onMounted(() => {
  if ((country.value as string).length === 0) {
    setCities([]);
  }
  const { query } = router.currentRoute.value;
  if (query.token && query.expires && query.email) {
    verifyMutation({
      token: query.token,
      expires: query.expires,
      email: query.email,
    });
  }
});

watch(country, (newVal, oldVal) => {
  if ((newVal as string).length === 0) {
    setCities([]);
  }
  if (newVal !== oldVal) {
    setCities([]);
  }
});

const setCountry = (arg: string) => {
  setFieldValue("country", arg);
  queryClient.invalidateQueries({ queryKey: ["cities"], exact: true });
};

const setCity = (arg: string) => {
  setFieldValue("city", arg);
};

const clearStatus = () => {
  status.value = null;
  sessionStorage.removeItem("status");
};

const onSubmit = handleSubmit((values) => {
  registerMutation(values);
});
</script>

<template>
  <AuthLayout>
    <div v-if="status === null">
      <h1 class="text-center text-3xl font-sans">Registration</h1>
      <p class="text-center text-md mt-3">
        Register on our E-commerce platform and explore our products.
      </p>
      <div class="m-auto w-[30%] h-[1.5px] bg-black mt-3 rounded-2xl"></div>
      <form
        @submit="onSubmit"
        class="grid grid-cols-2 sm:grid-cols-1 px-4 mt-6 gap-8 sm:gap-3"
      >
        <div>
          <Input type="text" name="fullName" label="Full name" />
          <Input type="email" name="email" label="Email" />
          <Input type="password" name="password" label="Password" />
          <Input type="password" name="c_password" label="Confirm Password" />
        </div>
        <div>
          <Select
            :value="(country as string)"
            label="Country of residence"
            :setCountry="setCountry"
            :setCity="setCity"
          />
          <input type="hidden" name="country" v-model="country" />
          <SelectForCity
            :value="(city as string)"
            label="City of residence"
            :setCity="setCity"
            :country="(country as string)"
          />
          <input name="city" type="hidden" v-model="city" />
          <Input type="text" name="address" label="Address" />
          <button
            type="submit"
            :disabled="isPending"
            class="bg-blue-400 max-h-[36px] capitalize text-white w-full min-w-full mt-10 py-[6px] rounded"
          >
            <Spinner v-if="isPending" />
            <span v-else>sign up</span>
          </button>
          <p class="text-sm pt-1 text-center sm:pb-4 w-full">
            Already have an account?
            <router-link to="/login" class="text-blue-500 underline"
              >Log in</router-link
            >
          </p>
        </div>
      </form>
    </div>
    <div
      class="flex items-center flex-col gap-4 justify-center"
      v-else-if="status === 'email-sent'"
    >
      <EmailVeficationSent :clearStatus="clearStatus" />
    </div>
    <div
      v-else-if="status === 'verified'"
      class="flex items-center flex-col gap-4 justify-center"
    >
      <EmailVerified :clearStatus="clearStatus" />
    </div>
    <div
      v-else-if="status === 'expired'"
      class="flex items-center flex-col gap-4 justify-center"
    >
      <Expired :clearStatus="clearStatus" />
    </div>
  </AuthLayout>
</template>
