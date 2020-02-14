

export type InputValidator<T> = (input: T) => boolean

const isStringLengthValid = (maxLen: number): InputValidator<string> => (input: string): boolean => input.length < maxLen

const isAddressFieldValid = isStringLengthValid(100)
const isNameFieldValid = isStringLengthValid(100)
const isPhoneNumberValid = isStringLengthValid(100)
const isEmailAddressValid = isStringLengthValid(100)

export const validators = {
    'Email': isEmailAddressValid,
    'Name': isNameFieldValid,
    'Postal Address': isAddressFieldValid,
    'Mobile Phone': isPhoneNumberValid,
}
