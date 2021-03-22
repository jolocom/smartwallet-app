
import { strings } from '~/translations'
import moment from 'moment'

import { ClaimKeys, DisplayCredential } from '~/types/credentials'
import { prepareLabel } from '~/utils/stringUtils'

export const filteredOptionalFields = [
  ClaimKeys.familyName,
  ClaimKeys.givenName,
  ClaimKeys.id,
  ClaimKeys.photo,
]

export const getOptionalFields = <T extends DisplayCredential>(credential: T) => {
  const additionalFields = [
    {
      label: strings.ISSUED,
      value: moment(credential.issued).format('DD.MM.YYYY')
    }, 
    {
      label: strings.ISSUER,
      value: credential.issuer.publicProfile?.name ?? credential.issuer.did
    },
    {
      label: strings.EXPIRES,
      value: moment(credential.expires).format('DD.MM.YYYY')
    }, 
  ]
  if(!credential.properties.length) return additionalFields
  return credential.properties.filter(p => !filteredOptionalFields.includes(p.key as ClaimKeys))
  .map(p => ({
    label: prepareLabel(p.label),
    value: p.value,
  }))
  .concat(additionalFields)
  .slice(0, 3)
}
