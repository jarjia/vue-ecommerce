import { loadImage } from "@/helpers";
import router from "@/routes";
import { getProduct, destroyProduct } from "@/services";
import { createCartItem } from "@/services/cartService";
import { useAuthData } from "@/store";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { ref } from "vue";

const useProductView = () => {
  const queryClient = useQueryClient();

  const cart = useAuthData();

  const isAlreadyInCart = ref(false);
  const isOutOfStock = ref(false);

  const { data, isLoading } = useQuery({
    queryFn: () =>
      getProduct(parseInt(router.currentRoute.value.params.id as string)),
    queryKey: ["product", router.currentRoute.value.params.id],
  });

  const { mutate: createCartItemMutation } = useMutation({
    mutationFn: createCartItem,
    onSuccess() {
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["cart-count"],
          exact: true,
        });
      }, 200);
    },
    onError(err: any) {
      if (err.response.status === 403) {
        isAlreadyInCart.value = true;
        setTimeout(() => {
          isAlreadyInCart.value = false;
        }, 2500);
      }
      if (err.response.status === 400) {
        isOutOfStock.value = true;
        setTimeout(() => {
          isOutOfStock.value = false;
        }, 2500);
      }
    },
  });

  const { mutate: deleteProductMutation } = useMutation({
    mutationFn: destroyProduct,
    onSuccess(data) {
      loadImage(data.data.thumbnails);
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
      router.push("/dashboard");
    },
  });

  const modules = [Navigation];

  const isShowThumbnails = ref(false);
  const swiperInstance = ref();
  const slide = ref(0);

  function onSwiper(swiper: any) {
    swiperInstance.value = swiper;
  }

  function goToSlide(position: number) {
    swiperInstance.value.slideTo(position);
  }

  const handleOffViewer = () => {
    isShowThumbnails.value = false;
  };

  const handleOnViewer = () => {
    isShowThumbnails.value = true;
  };

  const handleThumbnailViewer = (index: number) => {
    slide.value = index;
    setTimeout(() => {
      isShowThumbnails.value = !isShowThumbnails.value;
    }, 100);
  };

  return {
    data,
    handleOffViewer,
    handleOnViewer,
    isShowThumbnails,
    userData: cart.userData,
    slide,
    isLoading,
    handleThumbnailViewer,
    isAlreadyInCart,
    isOutOfStock,
    modules,
    onSwiper,
    deleteProductMutation,
    goToSlide,
    createCartItemMutation,
  };
};

export default useProductView;
