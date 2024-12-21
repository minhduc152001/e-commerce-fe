export function formatPrice(price: number, currency?: string): string {
  price = Math.floor(price);

  const formattedPrice = price.toLocaleString("vi-VN"); // Use Vietnamese locale for initial formatting
  return `${formattedPrice}${currency ? `${currency}` : "đ"}`.replace(
    ".",
    ","
  );
}

export const formatShortNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}T`; // Billion 1T
  } else if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}Tr`; // Million 1Tr
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}k`; // Thousand 1k
  } else {
    return num.toString(); // Less than 1,000
  }
};
