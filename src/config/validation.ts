import * as yup from 'yup'
import { ClaimKeys } from '~/types/credentials'

const AT_LEAST_ONE_ERROR = 'Please provide at least one of the values'

yup.addMethod(yup.object, 'atLeastOneOf', function (list: string[], message) {
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
  .atLeastOneOf([ClaimKeys.givenName, ClaimKeys.familyName], AT_LEAST_ONE_ERROR)

export const contactValidation = yup
  .object()
  .shape({
    [ClaimKeys.email]: yup
      .string()
      .email('Seems like this is not a valid email'),
    [ClaimKeys.telephone]: yup.string(),
  })
  .atLeastOneOf([ClaimKeys.email, ClaimKeys.telephone], AT_LEAST_ONE_ERROR)

export const companyValidation = yup.object().shape({
  [ClaimKeys.legalCompanyName]: yup
    .string()
    .required('Please provide a company name'),
})
