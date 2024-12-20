export function getRandomElement(arr: Array<any>) {
  const randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}

export function generateRandomNumber(min: number, max: number) {
  if (min > max) {
    throw new Error("Minimum value cannot be greater than the maximum value.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
