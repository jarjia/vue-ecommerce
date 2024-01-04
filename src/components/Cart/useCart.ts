import { deleteCartItems, getCartItems } from "@/services";
import { useAuthData } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ref, watch } from "vue";

const useCart = () => {
  const queryClient = useQueryClient();
  const cart = useAuthData();

  const { data, isLoading } = useQuery({
    queryFn: getCartItems,
    queryKey: ["cart"],
  });

  const dataRef = ref(data);
  const isDeleting = ref(false);

  watch(dataRef, (newData) => {
    cart.setInitialCartPrice(newData?.data.total);
  });

  const { mutate: deleteCartItemsMutation, isPending } = useMutation({
    mutationFn: deleteCartItems,
    onSuccess() {
      cart.setInitialCartPrice(0);

      queryClient.invalidateQueries({ queryKey: ["cart"], exact: true });
    },
  });

  const handleEmptyCart = () => {
    isDeleting.value = true;
    deleteCartItemsMutation();
    setTimeout(() => {
      isDeleting.value = false;
    }, 1000);
  };

  return {
    data,
    handleEmptyCart,
    isPending,
    isDeleting,
    isLoading,
    deleteCartItemsMutation,
  };
};

export default useCart;
