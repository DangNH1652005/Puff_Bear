// allSizes: full size objects from API ([ { id: "S", label: "S" }, ... ])
// product: product object containing sizeIds array
export const getProductSizes = (product, allSizes) => {
  return allSizes.filter((size) =>
    product?.sizeIds?.includes(size.id)
  );
};