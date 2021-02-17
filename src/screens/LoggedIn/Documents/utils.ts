import { IClaimSection } from 'jolocom-lib/js/credentials/credential/types'
import { IdentitySummary } from '@jolocom/sdk'

import { ClaimKeys } from '~/types/credentials'
import { prepareLabel } from '~/utils/stringUtils'

export const formatClaims = (claims: IClaimSection) =>
  Object.keys(claims).map((key) => ({
    name: prepareLabel(key),
    value: claims[key],
  }))

export const getSubjectName = (claim: IClaimSection) => {
  if (!!claim['givenName'] || !!claim['familyName']) {
    return {
      name: 'Subject name',
      value: `${claim['givenName']} ${claim['familyName']}`,
    }
  }

  return null
}

export const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

export const getOptionalFields = (claim: IClaimSection) =>
  Object.keys(claim)
    .filter((k) => !filteredOptionalFields.includes(k as ClaimKeys))
    .map((key) => ({
      name: prepareLabel(key),
      value: claim[key],
    }))
    .slice(0, 3)

export const getIssuerFields = (issuer: IdentitySummary) => {
  const fields = [{ name: 'Issuer Id', value: issuer.did }]
  const issuerProfile = issuer.publicProfile
  if (issuerProfile) {
    fields.push({ name: 'Issuer name', value: issuerProfile.name })
    fields.push({
      name: 'Issuer description',
      value: issuerProfile.description,
    })
    issuerProfile.url &&
      fields.push({ name: 'Issuer URL', value: issuerProfile.url })
  }

  return fields
}
