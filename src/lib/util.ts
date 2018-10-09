export const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

export const prepareLabel = (label: string): string => {
  const words = label.split(/(?=[A-Z])/)

  if (words && words.length > 1) {
    return words.map(capitalize).join(' ')
  }

  return capitalize(label)
}

export const capitalize = (word: string): string => `${word[0].toUpperCase()}${word.slice(1)}`
