export type CreateProduct = {
  name: string;
  price: number;
  quantity: number;
  images: File[] | string[];
  type: string;
};
export type Filters = {
  sort: string | null;
  search: string | null;
  pageParam: number | null;
};
export type AddCart = {
  seller_id: number;
  product_id: number;
};
export type ChangeQuantityCart = {
  cart_id: number;
  quantity: number;
};
