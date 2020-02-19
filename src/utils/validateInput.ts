export type InputValidator<T> = (input: T) => boolean

const isStringLengthValid = (maxLen: number): InputValidator<string> => (
  input: string,
): boolean => input.length < maxLen && input.length >= 0

const isAddressFieldValid = isStringLengthValid(100)
const isNameFieldValid = isStringLengthValid(100)
const isPhoneNumberValid = isStringLengthValid(100)
const isEmailAddressValid = isStringLengthValid(100)

export const inputFieldValidators: {
  [credType: string]: InputValidator<string>
} = {
  Email: isEmailAddressValid,
  Name: isNameFieldValid,
  'Postal Address': isAddressFieldValid,
  'Mobile Phone': isPhoneNumberValid,
}
