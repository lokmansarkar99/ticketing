// FUNCTION TO CALCULATE A DYNAMIC INDEX WITH META
export const generateDynamicIndexWithMeta = (response: any, index: number) => {
  const currentPage = response?.meta?.page;
  const currentSize = response?.meta?.size;
  const currentIndex = index + 1;
  if (currentPage > 0) {
    return currentSize * currentPage + currentIndex;
  } else {
    return currentIndex <= 9 ? "0" + currentIndex : currentIndex;
  }
};
