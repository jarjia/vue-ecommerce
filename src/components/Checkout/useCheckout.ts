import { getCartItems, getCities, checkoutProducts } from "@/services";
import { useAuthData } from "@/store";
import { ref, watch } from "vue";
import { useField, useForm } from "vee-validate";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { checkoutSchema } from "@/schema";
import router from "@/routes";

const useCheckout = () => {
  const auth = useAuthData();

  const showPaymentStatus = ref<string | null>(null);

  const queryClient = useQueryClient();

  const initialValues = {
    country: auth.$state.userData?.country,
    city: auth.$state.userData?.city,
    address: auth.$state.userData?.address,
  };

  const { data } = useQuery({
    queryFn: getCartItems,
    queryKey: ["cart"],
  });

  const { mutate: checkoutProductsMutation } = useMutation({
    mutationFn: checkoutProducts,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  const { mutate: getCitiesMutation } = useMutation({
    mutationFn: getCities,
    onSuccess(data) {
      auth.setCities(data.data.data);
    },
  });

  const { handleSubmit, setFieldValue } = useForm({
    validationSchema: checkoutSchema,
    initialValues,
  });

  const { value: country } = useField("country");
  const { value: city } = useField("city");
  const { value: address } = useField("address");

  watch(country, (newVal, oldVal) => {
    if (newVal !== oldVal) {
      setFieldValue("city", "");
      getCitiesMutation(newVal as string);
    }
  });

  watch(data, (newVal) => {
    if (newVal?.data.main_data.length < 1) {
      router.push("/cart");
    }
  });

  const setCountry = (arg: string) => {
    setFieldValue("country", arg);
    queryClient.invalidateQueries({ queryKey: ["cities"], exact: true });
  };

  const setCity = (arg: string) => {
    setFieldValue("city", arg);
  };

  return {
    checkoutProductsMutation,
    setCity,
    setCountry,
    data,
    auth,
    city,
    showPaymentStatus,
    address,
    country,
    handleSubmit,
  };
};

export default useCheckout;
