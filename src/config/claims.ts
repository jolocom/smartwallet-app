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
  businessCardValidation,
} from './validation'

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
        keyboardType: 'phone-pad',
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

const businessCardConfig: IAttributeConfig = {
  key: AttributeKeys.businessCard,
  label: strings.BUSINESS_CARD,
  // TODO: use config from cred-types-jolocom-core once available
  metadata: {
    type: ['Credential', 'ProofOfBusinessCardCredential'],
    name: 'Business Card',
    context: [
      {
        ProofOfBusinessCardCredential:
          'https://identity.jolocom.com/terms/ProofOfBusinessCardCredential',
        schema: 'http://schema.org/',
        familyName: 'schema:familyName',
        givenName: 'schema:givenName',
        email: 'schema:email',
        telephone: 'http://schema.org/telephone',
        legalCompanyName: 'schema:legalName',
      },
    ],
  },
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
    {
      key: ClaimKeys.email,
      label: strings.EMAIL,
      keyboardOptions: {
        keyboardType: 'email-address',
        autoCapitalize: 'none',
      },
    },
    {
      key: ClaimKeys.telephone,
      label: strings.NUMBER,
      keyboardOptions: {
        keyboardType: 'number-pad',
        autoCapitalize: 'none',
      },
    },
    {
      key: ClaimKeys.legalCompanyName,
      label: strings.COMPANY_NAME_FIELD,
      keyboardOptions: {
        keyboardType: 'default',
        autoCapitalize: 'words',
      },
    },
  ],
  validationSchema: businessCardValidation,
}

export const attributeConfig: Record<AttributeTypes, IAttributeConfig> = {
  [AttributeTypes.name]: nameConfig,
  [AttributeTypes.emailAddress]: emailConfig,
  [AttributeTypes.mobilePhoneNumber]: mobileNumberConfig,
  [AttributeTypes.postalAddress]: postalAddressConfig,
  [AttributeTypes.businessCard]: businessCardConfig,
}
