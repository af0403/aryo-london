export const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);

export const formatProductPrice = (
  price: number | null,
  note = "Price to be confirmed",
) => (price === null ? note : formatPrice(price));
