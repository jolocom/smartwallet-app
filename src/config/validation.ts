import * as yup from 'yup'
import { ObjectSchema } from 'yup'
import { strings } from '~/translations'
import { ClaimKeys } from '~/types/credentials'
import { InputValidation, regexValidations } from '~/utils/stringUtils'

yup.addMethod<ObjectSchema<any>>(
  yup.object,
  'atLeastOneOf',
  function (list: string[], message) {
    return this.test({
      message,
      test: function (values) {
        const atLeastOneIsPopulated = list.some((el) => Boolean(values[el]))
        if (atLeastOneIsPopulated) return true
        else return this.createError({ path: list[0], message })
      },
    })
  },
)

yup.addMethod(yup.string, 'phone', function () {
  return this.matches(
    // NOTE: regex for + or +1232312312312 -> to allow only numbers
    regexValidations[InputValidation.phone],
    strings.ONLY_NUMBERS,
  )
})

yup.addMethod(yup.string, 'customEmail', function() {
  return this.matches(
    regexValidations[InputValidation.email],
    strings.EMAIL_FORMAT_ERROR
  )
})

export const nameValidation = yup
  .object()
  .shape({
    [ClaimKeys.givenName]: yup.string(),
    [ClaimKeys.familyName]: yup.string(),
  })
  .atLeastOneOf(
    [ClaimKeys.givenName, ClaimKeys.familyName],
    strings.AT_LEAST_ONE_ERROR,
  )

export const emailValidation = yup.object().shape({
  [ClaimKeys.email]: yup
    .string()
    .customEmail()
    .max(100, strings.LARGE)
    .required(strings.VALUE_MISSING),
})

export const postalAddressValidation = yup.object().shape({
  [ClaimKeys.addressLine]: yup.string().required(strings.VALUE_MISSING),
  [ClaimKeys.postalCode]: yup.string().required(strings.VALUE_MISSING),
  [ClaimKeys.city]: yup.string().required(strings.VALUE_MISSING),
  [ClaimKeys.country]: yup.string().required(strings.VALUE_MISSING),
})

export const mobileNumberValidation = yup.object().shape({
  [ClaimKeys.telephone]: yup.string().phone().required(strings.VALUE_MISSING).min(7, strings.SHORT).max(17, strings.LARGE),
})

export const contactValidation = yup
  .object()
  .shape({
    [ClaimKeys.email]: yup.string().email(strings.EMAIL_FORMAT_ERROR),
    [ClaimKeys.telephone]: yup.string().phone(),
  })
  .atLeastOneOf(
    [ClaimKeys.email, ClaimKeys.telephone],
    strings.AT_LEAST_ONE_ERROR,
  )

export const companyValidation = yup.object().shape({
  [ClaimKeys.legalCompanyName]: yup.string().required(strings.VALUE_MISSING),
})
