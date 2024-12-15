export const calcNetPrice = (basePrice: number, discountPercentage: number) => {
    return (basePrice * (100 - discountPercentage)) / 100
}