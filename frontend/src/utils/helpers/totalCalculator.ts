export const totalCalculator = (
  numbersCollection: object[],
  propertyName: string
) => {
  if (!Array.isArray(numbersCollection) || numbersCollection.length === 0) {
    return 0;
  }

  // Safely sum up the main property values
  const total = numbersCollection
    .map((item: any) => Number(item?.[propertyName]) || 0)
    .reduce((sum, num) => sum + num, 0);

  // Safely sum up discounts (previousAmount)
  const discount = numbersCollection
    .map((item: any) => Number(item?.previousAmount) || 0)
    .reduce((sum, num) => sum + num, 0);

  return total - discount;
};
