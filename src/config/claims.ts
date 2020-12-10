import { claimsMetadata } from 'cred-types-jolocom-core'

import {
  IAttributeConfig,
  AttributeTypes,
  AttributeKeys,
  ClaimKeys,
} from '~/types/credentials'

// TODO: label & field label should come from strings
const emailConfig: IAttributeConfig = {
  key: AttributeKeys.emailAddress,
  label: 'Email',
  metadata: claimsMetadata[AttributeKeys.emailAddress],
  fields: [
    {
      key: ClaimKeys.email,
      keyboardType: 'email-address',
      label: 'E-mail address',
    },
  ],
}

const postalAddressConfig: IAttributeConfig = {
  key: AttributeKeys.postalAddress,
  label: 'Address Line',
  metadata: claimsMetadata[AttributeKeys.postalAddress],
  fields: [
    {
      key: ClaimKeys.addressLine,
      keyboardType: 'default',
      label: 'Address',
    },
    {
      key: ClaimKeys.postalCode,
      keyboardType: 'number-pad',
      label: 'Postal code',
    },
    {
      key: ClaimKeys.city,
      keyboardType: 'default',
      label: 'City',
    },
    {
      key: ClaimKeys.country,
      keyboardType: 'default',
      label: 'Country',
    },
  ],
}

const mobileNumberConfig: IAttributeConfig = {
  key: AttributeKeys.mobilePhoneNumber,
  label: 'Number',
  metadata: claimsMetadata[AttributeKeys.mobilePhoneNumber],
  fields: [
    {
      key: ClaimKeys.telephone,
      keyboardType: 'number-pad',
      label: 'Phone number',
    },
  ],
}

const nameConfig: IAttributeConfig = {
  key: AttributeKeys.name,
  label: 'Name',
  metadata: claimsMetadata[AttributeKeys.name],
  fields: [
    {
      key: ClaimKeys.givenName,
      keyboardType: 'default',
      label: 'Given name',
    },
    {
      key: ClaimKeys.familyName,
      keyboardType: 'default',
      label: 'Family name',
    },
  ],
}

export const attributeConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.name]: nameConfig,
}
