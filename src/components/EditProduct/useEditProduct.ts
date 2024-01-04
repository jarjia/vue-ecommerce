import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { editProductSchema } from "@/schema";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { editProduct, getProduct } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import router from "@/routes";

const useEditProduct = () => {
  const initialValues = {
    name: "",
    type: "",
    quantity: 1,
    description: "",
    images: [],
    price: 0,
  };

  const queryClient = useQueryClient();

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryFn: () =>
      getProduct(parseFloat(router.currentRoute.value.params.id as string)),
    queryKey: ["product", router.currentRoute.value.params.id],
  });

  const isDemo = ref(false);
  const files = ref<File[]>([]);
  const images = ref<string[]>([]);
  const swiperInstance = ref();
  const isMounted = ref(false);

  watch(data, (newVal) => {
    isMounted.value = false;
    if (newVal) {
      let fetchedImages = data.value?.data.thumbnails.map(
        (item: string) => item
      );
      setValues({
        name: data.value?.data.name,
        type: data.value?.data.type,
        quantity: data.value?.data.quantity,
        price: parseFloat(data.value?.data.price),
        images: [...fetchedImages],
        description: data.value?.data.description,
      });
      files.value = [...fetchedImages];
      images.value = [...fetchedImages];
      isMounted.value = true;
    } else {
      refetch();
    }
  });

  const {
    handleSubmit,
    setValues,
    setFieldValue,
    defineInputBinds,
    submitCount,
    errors,
  } = useForm({
    validationSchema: editProductSchema,
    initialValues,
  });

  const { mutate: editProductMutation, isPending } = useMutation({
    mutationFn: editProduct,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
      queryClient.invalidateQueries({
        queryKey: ["user-products"],
        exact: true,
      });
      router.back();
    },
  });

  const name = defineInputBinds("name");
  const description = defineInputBinds("description");
  const price = defineInputBinds("price");
  const quantity = defineInputBinds("quantity");
  const type = defineInputBinds("type");

  const modules = [Navigation];

  watch(price, (newVal) => {
    if (newVal.value) {
      if (newVal.value < 0) {
        setFieldValue("price", 0);
      }
      if (newVal.value > 100000) {
        setFieldValue("price", 100000);
      }
    }
  });

  watch(quantity, (newVal) => {
    if (newVal.value) {
      if (newVal.value < 0) {
        setFieldValue("quantity", 1);
      }
      if (newVal.value > 100) {
        setFieldValue("quantity", 100);
      }
    }
  });

  const uploadFiles = (e: Event) => {
    let imgFiles = [...files.value];
    const target = e.target as HTMLInputElement;
    if (target.files) {
      const imgs = target.files;
      for (let i = 0; i < imgs.length; i++) {
        if (images.value.length < 9) {
          images.value.push(URL.createObjectURL(imgs[i]));
          imgFiles.push(imgs[i]);
          files.value.push(imgs[i]);
        }
      }
    }
    setFieldValue("images", imgFiles);
  };

  const handleDrop = (e: DragEvent) => {
    const imgs = e.dataTransfer?.files;
    let imgFiles = [...files.value];
    if (imgs && imgs.length > 0) {
      for (let i = 0; i < imgs.length; i++) {
        if (images.value.length < 9) {
          images.value.push(URL.createObjectURL(imgs[i]));
          files.value.push(imgs[i]);
          imgFiles.push(imgs[i]);
        }
      }
    }
    setFieldValue("images", imgFiles);
  };

  const handleDropChange = (e: DragEvent, index: number) => {
    const droppedFiles = e.dataTransfer?.files;

    if (droppedFiles && droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0];

      files.value.splice(index, 1, droppedFile);

      images.value.splice(index, 1, URL.createObjectURL(droppedFile));
    }
    setFieldValue("images", files.value);
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDelete = (index: number) => {
    files.value.splice(index, 1);
    images.value.splice(index, 1);
    setFieldValue("images", files.value);
  };

  const handleChange = (e: Event, index: number) => {
    const target = e.target as HTMLInputElement;

    if (target?.files?.length) {
      const selectedFile = target.files[0];

      files.value.splice(index, 1, selectedFile);

      images.value.splice(index, 1, URL.createObjectURL(selectedFile));
    }
    setFieldValue("images", files.value);
  };

  const onSwiper = (swiper: any) => {
    swiperInstance.value = swiper;
  };

  const goToSlide = (position: number) => {
    swiperInstance.value.slideTo(position);
  };

  const onSubmit = handleSubmit((values) => {
    let newFiles = [];
    let images = [];
    for (let instance of values.images) {
      if (typeof instance !== "string") {
        newFiles.push({
          order: values.images.indexOf(instance),
          file: instance,
        });
      } else {
        images.push({
          order: values.images.indexOf(instance),
          image: instance,
        });
      }
    }

    values.images = images;
    values.files = newFiles;

    let props = {
      productId: parseFloat(router.currentRoute.value.params.id as string),
      data: values,
    };

    editProductMutation(props);
  });

  return {
    name,
    quantity,
    price,
    description,
    type,
    isDemo,
    images,
    modules,
    setFieldValue,
    goToSlide,
    onSwiper,
    handleChange,
    handleDragOver,
    handleDelete,
    onSubmit,
    handleDropChange,
    handleDrop,
    errors,
    uploadFiles,
    submitCount,
    isSuccess,
    isLoading,
    isMounted,
    isPending,
  };
};

export default useEditProduct;
