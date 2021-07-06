import { claimsMetadata } from '@jolocom/protocol-ts'

import {
  IAttributeConfig,
  AttributeTypes,
  AttributeKeys,
  ClaimKeys,
} from '~/types/credentials'
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
  label: 'Identity.emailLabel',
  metadata: claimsMetadata[AttributeKeys.emailAddress],
  fields: [
    {
      key: ClaimKeys.email,
      label: 'Identity.emailLabel',
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
  label: 'Indentity.addressLabel',
  metadata: claimsMetadata[AttributeKeys.postalAddress],
  fields: [
    {
      key: ClaimKeys.addressLine,
      label: 'Placeholder.addressLine',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.postalCode,
      label: 'Placeholder.postalCode',
      keyboardOptions: {
        keyboardType: numberPadKeyboardType,
        autoCapitalize: 'none',
      },
    },
    {
      key: ClaimKeys.city,
      label: 'Placeholder.city',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.country,
      label: 'Placeholder.country',
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
  label: 'Identity.phoneNumberLabel',
  metadata: claimsMetadata[AttributeKeys.mobilePhoneNumber],
  fields: [
    {
      key: ClaimKeys.telephone,
      label: 'Identity.phoneNumberLabel',
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
  label: 'Identity.nameLabel',
  metadata: claimsMetadata[AttributeKeys.name],
  fields: [
    {
      key: ClaimKeys.givenName,
      label: 'InputPlaceholder.givenName',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
    {
      key: ClaimKeys.familyName,
      label: 'InputPlaceholder.familyName',
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
