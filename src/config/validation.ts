import * as yup from 'yup';
import { ClaimKeys } from '~/types/credentials';

const AT_LEAST_ONE_ERROR = 'Please provide at least one of the values';

yup.addMethod(yup.string, 'atLeastOne', function (list: string[], message): yup.StringSchema {
    return this.test({
      message,
      test: function (value) {
        const atLeastOneIsPopulated = list.reduce((acc, f) => {
          if (acc === true) {
            acc = !!this.parent[f];
          }
          return acc;
        }, true);
        console.log();
        if (value || (!value && atLeastOneIsPopulated)) return true;
        else if (!value && !atLeastOneIsPopulated) return false
        else return true;
      }
    })
  })

export const nameValidation = yup.object().shape({
  [ClaimKeys.givenName]: yup.string().atLeastOne(['familyName'], AT_LEAST_ONE_ERROR),
  [ClaimKeys.familyName]: yup.string(),
});

export const contactValidation = yup.object().shape({
  [ClaimKeys.email]: yup.string().email('Seems like this is not a valid email').atLeastOne([ClaimKeys.telephone], AT_LEAST_ONE_ERROR),
  [ClaimKeys.telephone]: yup.string()
})

export const companyValidation = yup.object().shape({
  [ClaimKeys.legalCompanyName]: yup.string().required('Please provide a company name')
})