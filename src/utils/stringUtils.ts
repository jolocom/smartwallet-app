export const truncateFirstWord = (text: string) => text.split(' ')[0]

export const capitalizeWord = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

export enum InputValidation {
  email = 'email',
  phone = 'phone',
  all = 'all',
}

export const regexValidations = {
  [InputValidation.all]: /./,
  [InputValidation.email]: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  [InputValidation.phone]: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
}

export const validateString = (value: string, validation: InputValidation) => {
  return regexValidations[validation].test(value)
}
