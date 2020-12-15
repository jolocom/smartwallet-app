import { claimsMetadata } from 'cred-types-jolocom-core'

import {
  IAttributeConfig,
  AttributeTypes,
  AttributeKeys,
  ClaimKeys,
} from '~/types/credentials'
import { strings } from '~/translations'

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
        keyboardType: 'number-pad',
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
        keyboardType: 'phone-pad',
        autoCapitalize: 'none',
      },
    },
  ],
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
}

export const attributeConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.name]: nameConfig,
}
