import crypto from 'crypto'

export const truncateFirstWord = (text: string) => text.split(' ')[0]

export const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export const camelCaseToFriendly = (label: string): string => {
  const words = label.split(/(?=[A-Z0-9])/)
  return words.length > 1
    ? words.map(capitalizeWord).join(' ')
    : capitalizeWord(label)
}

export const trimObjectValues = (obj: Record<string, string>) =>
  Object.keys(obj).reduce<Record<string, string>>(
    (acc, claimKey) => ({ ...acc, [claimKey]: obj[claimKey].trim() }),
    {},
  )

export const truncateString = (text: string, n: number) =>
  text.length <= n ? text : text.slice(0, n) + '...'

export enum InputValidation {
  email = 'email',
  phone = 'phone',
  all = 'all',
}

export const regexValidations = {
  [InputValidation.all]: /./,
  [InputValidation.email]:
    /^(?!\.|_|-{1})+(\d*?[a-z]+\d*)+(([_\.\-])?((?!_)\w))+@([a-z0-9])+([\.\-])?((?!_)\w)+(\.)([a-z][a-z\d]{1,4})+$/,
  [InputValidation.phone]: /^(?:\+|0|\(\d+\)) ?(?:[0-9] ?){0,14}[0-9]$/,
}

export const generateRandomString = (length: number) => {
  return crypto.randomBytes(length).toString('hex')
}
