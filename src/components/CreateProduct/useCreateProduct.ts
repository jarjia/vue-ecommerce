import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { createProductSchema } from "@/schema";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import { createProduct } from "@/services";
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import router from "@/routes";

const useCreateProduct = () => {
  const initialValues = {
    name: "",
    type: "",
    quantity: 1,
    description: "",
    images: [],
    price: 0,
  };

  const queryClient = useQueryClient();

  const { handleSubmit, setFieldValue, defineInputBinds, submitCount, errors } =
    useForm({
      validationSchema: createProductSchema,
      initialValues,
    });

  const { mutate: createProductMutation, isPending } = useMutation({
    mutationFn: createProduct,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["products"], exact: true });
      router.push("/dashboard");
    },
  });

  const name = defineInputBinds("name");
  const description = defineInputBinds("description");
  const price = defineInputBinds("price");
  const quantity = defineInputBinds("quantity");
  const type = defineInputBinds("type");

  const isDemo = ref(false);
  const files = ref<File[]>([]);
  const images = ref<{ img: string; type?: string }[]>([]);
  const swiperInstance = ref();

  const modules = [Navigation];

  watch(price, (newVal) => {
    if (newVal.value) {
      if (newVal.value < 0) {
        setFieldValue("price", 0);
      }
      if (newVal.value > 100000000) {
        setFieldValue("price", 100000000);
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
          images.value.push({
            img: URL.createObjectURL(imgs[i]),
          });
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
          images.value.push({
            img: URL.createObjectURL(imgs[i]),
          });
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

      images.value.splice(index, 1, {
        img: URL.createObjectURL(droppedFile),
      });
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

      images.value.splice(index, 1, {
        img: URL.createObjectURL(selectedFile),
      });
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
    createProductMutation(values);
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
    isPending,
  };
};

export default useCreateProduct;
