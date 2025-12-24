export const objectCopier = <T>(originalObject: T, quantity: number): T[] => {
  if (quantity <= 0) {
    return [];
  }
  return Array.from({ length: quantity }, () => ({ ...originalObject }));
};
