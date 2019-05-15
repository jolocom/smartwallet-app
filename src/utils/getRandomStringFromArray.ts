export function getRandomStringFromArray(arr: string[]): string {
  const length = arr.length
  const randomNum = Math.floor(Math.random() * length)
  return arr[randomNum]
}
