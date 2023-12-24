export const sorts = [
  "no sorting",
  "Price lower to higher",
  "Price higher to lower",
  "New to old",
  "Old to new",
];

export const isFreeProduct = (str: string) => {
  return /^[0.]+$/.test(str);
};
