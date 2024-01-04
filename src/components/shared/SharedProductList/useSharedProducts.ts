import router from "@/routes";
import { getProducts, getUserProducts } from "@/services";
import { sorts } from "@/helpers";
import { useInfiniteQuery, FetchNextPageOptions } from "@tanstack/vue-query";
import { onBeforeUnmount, onMounted, ref } from "vue";

const useSharedProducts = () => {
  const page = ref<number>(
    parseInt(router.currentRoute.value.query.p as string) || 1
  );

  const {
    data,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
  } = useInfiniteQuery({
    queryKey:
      router.currentRoute.value.name === "dashboard"
        ? ["user-products"]
        : ["products"],
    getNextPageParam: (lastPage: any) => {
      return lastPage.data.all_pages >= page.value ? page.value : undefined;
    },
    getPreviousPageParam: () => {
      return page.value + 1 > 1 ? page.value : undefined;
    },
    queryFn:
      router.currentRoute.value.name === "dashboard"
        ? ({ pageParam = 1 }) =>
            getUserProducts({
              pageParam: pageParam,
              sort: router.currentRoute.value.query.sort as string,
              search: (router.currentRoute.value.query.search as string) || "",
            })
        : ({ pageParam = 1 }) =>
            getProducts({
              pageParam: pageParam,
              sort: router.currentRoute.value.query.sort as string,
              search: (router.currentRoute.value.query.search as string) || "",
            }),
    initialPageParam: page.value,
  });

  onMounted(() => {
    let pageNow = router.currentRoute.value.query.p
      ? parseInt(router.currentRoute.value.query.p as string)
      : 1;
    if (
      pageNow > data.value?.pages[page.value - 1].data.all_pages ||
      pageNow < 1
    ) {
      page.value = 1;
      router.push({
        query: { ...router.currentRoute.value.query, p: 1 },
      });
    }
  });

  const paginating = ref(false);
  const isSort = ref(false);
  const search = ref(router.currentRoute.value.query.search || "");

  const sort = ref(
    router.currentRoute.value.query.sort
      ? router.currentRoute.value.query.sort
      : sorts[0]
  );

  const handleIsPaginating = () => {
    paginating.value = true;
    setTimeout(() => {
      paginating.value = false;
    }, 600);
  };

  const close = (e: MouseEvent) => {
    const targetElement = e.target as Element;

    if (!targetElement.closest(".sort-drop")) {
      isSort.value = false;
    } else {
      let obj = document.getElementById("search") as HTMLElement;
      obj.focus();
    }
  };

  const handleNext = () => {
    let pageNow = router.currentRoute.value.query.p
      ? parseInt(router.currentRoute.value.query.p as string)
      : 1;
    if (pageNow < data.value?.pages[page.value - 1].data.all_pages) {
      handleIsPaginating();
      let newPage = page.value === null ? 2 : page.value + 1;
      page.value = newPage;
      router.push({
        query: { ...router.currentRoute.value.query, p: newPage },
      });
      if (!data.value?.pageParams.includes(page.value)) {
        fetchNextPage();
      }
    }
  };

  const handlePrev = () => {
    let pageNow = router.currentRoute.value.query.p
      ? parseInt(router.currentRoute.value.query.p as string)
      : 1;
    if (pageNow > 1) {
      handleIsPaginating();
      let newPage = page.value === null ? 2 : page.value - 1;
      page.value = newPage;
      router.push({
        query: { ...router.currentRoute.value.query, p: newPage },
      });
      if (!data.value?.pageParams.includes(page.value)) {
        fetchPreviousPage();
      }
    }
  };

  const handleCustomPage = (pageArg: number) => {
    const nextPageOptions: FetchNextPageOptions & {
      pageParam: number;
    } = {
      pageParam: pageArg,
    };

    if (pageArg > 0 && pageArg <= data.value?.pages[0].data.all_pages) {
      handleIsPaginating();
      page.value = pageArg;
      router.push({
        query: { ...router.currentRoute.value.query, p: pageArg },
      });
      if (!data.value?.pageParams.includes(pageArg)) {
        fetchNextPage(nextPageOptions);
      }
    }
  };

  const changeSort = (sortItem: string) => {
    isSort.value = false;
    sort.value = sortItem;
    if (router.currentRoute.value.query.sort !== sortItem) {
      if (sortItem !== "no sorting") {
        router.push({
          query: { ...router.currentRoute.value.query, sort: sortItem },
        });
        setTimeout(() => {
          refetch();
        }, 300);
      } else {
        if (router.currentRoute.value.query.sort) {
          router.push("/product-list");
          setTimeout(() => {
            refetch();
          }, 300);
        }
      }
    }
  };

  const handleSearch = () => {
    if (search.value !== router.currentRoute.value.query.search) {
      setTimeout(() => {
        refetch();
        handleCustomPage(1);
      }, 300);
      router.push({
        query: {
          ...router.currentRoute.value.query,
          search: search.value,
        },
      });
    }
  };

  onMounted(() => {
    document.addEventListener("click", close);
  });

  onBeforeUnmount(() => {
    document.removeEventListener("click", close);
  });

  return {
    router,
    page,
    sort,
    sorts,
    isLoading,
    isRefetching,
    data,
    search,
    isSort,
    paginating,
    isFetchingNextPage,
    isFetchingPreviousPage,
    handleCustomPage,
    handleNext,
    handlePrev,
    handleSearch,
    changeSort,
  };
};

export default useSharedProducts;
