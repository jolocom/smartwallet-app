import { IdentitySummary } from '@jolocom/sdk'

import { ClaimKeys, DisplayCredential } from '~/types/credentials'
import { prepareLabel } from '~/utils/stringUtils'

export const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

export const formatClaims = (properties: DisplayCredential['properties']) => properties.map(p => ({
  label: prepareLabel(p.key),
  value: p.value,
}))

export const getOptionalFields = (properties: DisplayCredential['properties']) => {
  if(!properties.length) return []
  return properties.filter(p => !filteredOptionalFields.includes(p.key as ClaimKeys))
  .map(p => ({
    label: prepareLabel(p.label),
    value: p.value,
  }))
  .slice(0, 3)
}


// TODO: use translation strings
export const getIssuerFields = (issuer: IdentitySummary) => {
  const fields = [{ label: 'Issuer Id', value: issuer.did }]
  const issuerProfile = issuer.publicProfile
  if (issuerProfile) {
    fields.push({ label: 'Issuer name', value: issuerProfile.name })
    fields.push({
      label: 'Issuer description',
      value: issuerProfile.description,
    })
    issuerProfile.url &&
      fields.push({ label: 'Issuer URL', value: issuerProfile.url })
  }

  return fields
}
