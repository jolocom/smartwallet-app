export const truncateFirstWord = (text: string) => text.split(' ')[0]

export const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)
