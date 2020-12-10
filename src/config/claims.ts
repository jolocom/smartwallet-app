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
      label: 'E-mail address',
      keyboardOptions: {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      },
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
      label: 'Address',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.postalCode,
      label: 'Postal code',
      keyboardOptions: {
        keyboardType: 'number-pad',
        autoCapitalize: 'none',
      },
    },
    {
      key: ClaimKeys.city,
      label: 'City',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'sentences',
      },
    },
    {
      key: ClaimKeys.country,
      label: 'Country',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
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
      label: 'Phone number',
      keyboardOptions: {
        keyboardType: 'number-pad',
        autoCapitalize: 'none',
      },
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
      label: 'Given name',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
    {
      key: ClaimKeys.familyName,
      label: 'Family name',
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
  ],
}

export const attributeConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.name]: nameConfig,
}
