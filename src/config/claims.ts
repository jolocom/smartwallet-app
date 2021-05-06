import { claimsMetadata } from '@jolocom/protocol-ts'

import {
  IAttributeConfig,
  AttributeTypes,
  AttributeKeys,
  ClaimKeys,
} from '~/types/credentials'
import { strings } from '~/translations'
import {
  emailValidation,
  nameValidation,
  postalAddressValidation,
  mobileNumberValidation,
} from './validation'
import { Platform, KeyboardTypeOptions } from 'react-native'

// NOTE: the default `number-pad` type doesn't have the submit button on ios
const numberPadKeyboardType: KeyboardTypeOptions = Platform.select({
  ios: 'numbers-and-punctuation',
  default: 'number-pad',
})

// TODO: add input validation for each field
const emailConfig: IAttributeConfig = {
  key: AttributeKeys.emailAddress,
  label: strings.EMAIL,
  metadata: claimsMetadata[AttributeKeys.emailAddress],
  fields: [
    {
      key: ClaimKeys.email,
      label: strings.EMAIL,
      keyboardOptions: {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      },
    },
  ],
  validationSchema: emailValidation,
}

const postalAddressConfig: IAttributeConfig = {
  key: AttributeKeys.postalAddress,
  label: strings.ADDRESS,
  metadata: claimsMetadata[AttributeKeys.postalAddress],
  fields: [
    {
      key: ClaimKeys.addressLine,
      label: strings.ADDRESS_LINE_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.postalCode,
      label: strings.POSTAL_CODE_FIELD,
      keyboardOptions: {
        keyboardType: numberPadKeyboardType,
        autoCapitalize: 'none',
      },
    },
    {
      key: ClaimKeys.city,
      label: strings.CITY_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.country,
      label: strings.COUNTRY_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
  ],
  validationSchema: postalAddressValidation,
}

const mobileNumberConfig: IAttributeConfig = {
  key: AttributeKeys.mobilePhoneNumber,
  label: strings.NUMBER,
  metadata: claimsMetadata[AttributeKeys.mobilePhoneNumber],
  fields: [
    {
      key: ClaimKeys.telephone,
      label: strings.NUMBER,
      keyboardOptions: {
        keyboardType: numberPadKeyboardType,
        autoCapitalize: 'none',
      },
    },
  ],
  validationSchema: mobileNumberValidation,
}

const nameConfig: IAttributeConfig = {
  key: AttributeKeys.name,
  label: strings.NAME,
  metadata: claimsMetadata[AttributeKeys.name],
  fields: [
    {
      key: ClaimKeys.givenName,
      label: strings.GIVEN_NAME_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
    {
      key: ClaimKeys.familyName,
      label: strings.FAMILY_NAME_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
  ],
  validationSchema: nameValidation,
}

export const attributeConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.name]: nameConfig,
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
}
