export const truncateFirstWord = (text: string) => text.split(' ')[0]

export const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export const camelCaseToFriendly = (label: string): string => {
  const words = label.split(/(?=[A-Z0-9])/)
  return words.length > 1
    ? words.map(capitalizeWord).join(' ')
    : capitalizeWord(label)
}

export const trimObjectValues = (obj: Record<string, string>) => {
  return Object.keys(obj).reduce<Record<string, string>>((acc, claimKey) => {
    return { ...acc, [claimKey]: obj[claimKey].trim() }
  }, {})
}

export enum InputValidation {
  email = 'email',
  phone = 'phone',
  all = 'all',
}

export const regexValidations = {
  [InputValidation.all]: /./,
  [InputValidation.email]:
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  [InputValidation.phone]:
    /^\+{1}\d+$|^\+$/,
}
