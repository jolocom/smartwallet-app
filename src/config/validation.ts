import * as yup from 'yup'
import { ObjectSchema } from 'yup'
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
    'Validations.onlyNumbers',
  )
})

yup.addMethod(yup.string, 'customEmail', function () {
  return this.matches(
    regexValidations[InputValidation.email],
    'Validations.wrongEmail',
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
    'Validations.atLeastOneValue',
  )

export const emailValidation = yup.object().shape({
  [ClaimKeys.email]: yup
    .string()
    .customEmail()
    .max(100, 'Validations.tooMany')
    .required('Validations.missingValue'),
})

export const postalAddressValidation = yup.object().shape({
  [ClaimKeys.addressLine]: yup.string().required('Validations.missingValue'),
  [ClaimKeys.postalCode]: yup.string().required('Validations.missingValue'),
  [ClaimKeys.city]: yup.string().required('Validations.missingValue'),
  [ClaimKeys.country]: yup.string().required('Validations.missingValue'),
})

export const mobileNumberValidation = yup.object().shape({
  [ClaimKeys.telephone]: yup
    .string()
    .phone()
    .required('Validations.missingValue')
    .min(7, 'Validations.tooFew')
    .max(17, 'Validations.tooMany'),
})

export const contactValidation = yup
  .object()
  .shape({
    [ClaimKeys.email]: yup.string().email('Validations.wrongEmail'),
    [ClaimKeys.telephone]: yup.string().phone(),
  })
  .atLeastOneOf(
    [ClaimKeys.email, ClaimKeys.telephone],
    'Validations.atLeastOneValue',
  )

export const companyValidation = yup.object().shape({
  [ClaimKeys.legalCompanyName]: yup
    .string()
    .required('Validations.missingValue'),
})
