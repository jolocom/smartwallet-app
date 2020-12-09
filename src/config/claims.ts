import { claimsMetadata } from 'cred-types-jolocom-core'

import { IClaimConfig, ClaimTypes } from '~/types/credentials'

// TODO: label should be from strings
// TODO: metadata.name should be translated. Can be added to strings
const emailConfig: IClaimConfig = {
  key: ClaimKeys.emailAddress,
  metadata: claimsMetadata[ClaimKeys.emailAddress],
  fields: [
    {
      key: 'email',
      keyboardType: 'email-address',
      label: 'E-mail address',
    },
  ],
}

const postalAddressConfig: IClaimConfig = {
  key: ClaimKeys.postalAddress,
  metadata: claimsMetadata[ClaimKeys.postalAddress],
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

const mobileNumberConfig: IClaimConfig = {
  key: ClaimKeys.mobilePhoneNumber,
  metadata: claimsMetadata[ClaimKeys.mobilePhoneNumber],
  fields: [
    {
      key: 'telephone',
      keyboardType: 'number-pad',
      label: 'Phone number',
    },
  ],
}

const nameConfig: IClaimConfig = {
  key: ClaimKeys.name,
  metadata: claimsMetadata[ClaimKeys.name],
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

export const claimsConfig: Record<ClaimTypes, IClaimConfig> = {
  [ClaimTypes.emailAddress]: emailConfig,
  [ClaimTypes.postalAddress]: postalAddressConfig,
  [ClaimTypes.mobilePhoneNumber]: mobileNumberConfig,
  [ClaimTypes.name]: nameConfig,
}
