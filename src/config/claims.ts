import { claimsMetadata } from 'cred-types-jolocom-core'

import {
  IAttributeConfig,
  AttributeTypes,
  AttributeKeys,
} from '~/types/credentials'

// TODO: label should be from strings
// TODO: metadata.name should be translated. Can be added to strings
const emailConfig: IAttributeConfig = {
  key: AttributeKeys.emailAddress,
  metadata: claimsMetadata[AttributeKeys.emailAddress],
  fields: [
    {
      key: 'email',
      keyboardType: 'email-address',
      label: 'E-mail address',
    },
  ],
}

const postalAddressConfig: IAttributeConfig = {
  key: AttributeKeys.postalAddress,
  metadata: claimsMetadata[AttributeKeys.postalAddress],
  fields: [
    {
      key: 'addressLine1',
      keyboardType: 'default',
      label: 'Address',
    },
    {
      key: 'postalCode',
      keyboardType: 'default',
      label: 'Postal code',
    },
    {
      key: 'city',
      keyboardType: 'default',
      label: 'City',
    },
    {
      key: 'country',
      keyboardType: 'default',
      label: 'Country',
    },
  ],
}

const mobileNumberConfig: IAttributeConfig = {
  key: AttributeKeys.mobilePhoneNumber,
  metadata: claimsMetadata[AttributeKeys.mobilePhoneNumber],
  fields: [
    {
      key: 'telephone',
      keyboardType: 'number-pad',
      label: 'Phone number',
    },
  ],
}

const nameConfig: IAttributeConfig = {
  key: AttributeKeys.name,
  metadata: claimsMetadata[AttributeKeys.name],
  fields: [
    {
      key: 'givenName',
      keyboardType: 'default',
      label: 'Given name',
    },
    {
      key: 'familyName',
      keyboardType: 'default',
      label: 'Family name',
    },
  ],
}

export const claimsConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.name]: nameConfig,
}
