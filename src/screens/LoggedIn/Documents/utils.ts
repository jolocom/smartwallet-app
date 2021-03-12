import { IdentitySummary } from '@jolocom/sdk'

import { ClaimKeys } from '~/types/credentials'
import { prepareLabel } from '~/utils/stringUtils'
import { DisplayCredential } from '~/hooks/signedCredentials/types'

export const formatClaims = (properties: Pick<DisplayCredential, 'properties'>) => properties.map(p => ({
    name: prepareLabel(p.key),
    value: p.value,
  }))

export const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

export const getOptionalFields = (properties: Pick<DisplayCredential, 'properties'>) => {
  return properties.filter(p => !filteredOptionalFields.includes(p.key as ClaimKeys))
  .map(p => ({
    name: prepareLabel(p.label),
    value: p.value,
  }))
  .slice(0, 3)
}

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
