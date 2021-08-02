import { strings } from '~/translations'
import moment from 'moment'

import { ClaimKeys, DisplayCredential } from '~/types/credentials'

export const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

export const getOptionalFields = <T extends DisplayCredential>(
  credential: T,
) => {
  const additionalFields = [
    {
      key: 'issued',
      label: strings.ISSUED,
      value: moment(credential.issued).format('DD.MM.YYYY'),
    },
    {
      key: 'issuer',
      label: strings.ISSUER,
      value: credential.issuer?.publicProfile?.name ?? credential.issuer.did,
    },
    {
      key: 'expires',
      label: strings.EXPIRES,
      value: moment(credential.expires).format('DD.MM.YYYY'),
    },
  ]

  if (!credential.properties.length) return additionalFields
  return credential.properties
    .filter((p) => !filteredOptionalFields.includes(p.key as ClaimKeys))
    .map(({ label, value, key }) => ({
      key,
      label: label || strings.NOT_SPECIFIED,
      value: value || strings.NOT_SPECIFIED,
    }))
    .concat(additionalFields)
}
