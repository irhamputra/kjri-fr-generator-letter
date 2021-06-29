export const formatCurrencyToEUR = (amount: number) => {
  const { format } = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
  });

  return format(amount);
};
