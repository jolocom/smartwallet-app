import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { strings } from '~/translations'
import { ClaimKeys } from '~/types/credentials'

yup.addMethod<ObjectSchema<any>>(yup.object, 'atLeastOneOf', function (list: string[], message) {
  return this.test({
    message,
    test: function (values) {
      const atLeastOneIsPopulated = list.some((el) => Boolean(values[el]))
      if (atLeastOneIsPopulated) return true
      else return this.createError({ path: list[0], message })
    },
  })
})

export const nameValidation = yup
  .object()
  .shape({
    [ClaimKeys.givenName]: yup.string(),
    [ClaimKeys.familyName]: yup.string(),
  })
  .atLeastOneOf([ClaimKeys.givenName, ClaimKeys.familyName], strings.AT_LEAST_ONE_ERROR)

export const emailValidation = yup.object().shape({
  [ClaimKeys.email]: yup.string().email(strings.EMAIL_FORMAT_ERROR).required(strings.VALUE_MISSING)
})

export const postalAddressValidation = yup.object().shape({
  [ClaimKeys.addressLine]: yup.string(),
  [ClaimKeys.postalCode]: yup.string(),
  [ClaimKeys.city]: yup.string(),
  [ClaimKeys.country]: yup.string()
})

export const mobileNumberValidation = yup.object().shape({
  [ClaimKeys.email]: yup.string().email(strings.EMAIL_FORMAT_ERROR).required(strings.VALUE_MISSING)
})

export const contactValidation = yup
  .object()
  .shape({
    [ClaimKeys.email]: yup
      .string()
      .email(strings.EMAIL_FORMAT_ERROR),
    [ClaimKeys.telephone]: yup.string(),
  })
  .atLeastOneOf([ClaimKeys.email, ClaimKeys.telephone], strings.AT_LEAST_ONE_ERROR)

export const companyValidation = yup.object().shape({
  [ClaimKeys.legalCompanyName]: yup
    .string()
    .required(strings.VALUE_MISSING),
})
