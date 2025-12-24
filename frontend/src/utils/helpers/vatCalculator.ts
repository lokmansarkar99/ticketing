export const vatCalculator = (baseAmount: number | string, vatRate: number) => {
  const vatAmount = +baseAmount * (vatRate / 100);
  return vatAmount;
};
