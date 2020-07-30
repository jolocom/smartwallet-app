import { claimsMetadata } from 'cred-types-jolocom-core'

import { AttrKeys } from '~/types/attributes'
import { AttributeI } from '~/modules/attributes/types'

export const fieldNames = {
  [AttrKeys.name]: 'name',
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'number',
  [AttrKeys.postalAddress]: 'address',
}

export const credentialSchemas = Object.keys(claimsMetadata).reduce(
  (acc, v) => {
    const value = v as AttrKeys
    acc[value] = claimsMetadata[value].type[1]
    return acc
  },
  {} as { [key: string]: string },
)

type InitialEntryValueT = undefined | AttributeI[]
export interface CredentialI {
  id: string
  claim: {
    [key: string]: string
  }
}

export const makeAttrEntry = (
  attrKey: AttrKeys,
  initialValue: InitialEntryValueT,
  v: CredentialI,
) => {
  let entry: AttributeI = { id: v.id, value: '' }
  if (attrKey === AttrKeys.name) {
    entry.value = `${v.claim.givenName} ${v.claim.familyName}`
  } else if (attrKey === AttrKeys.emailAddress) {
    entry.value = v.claim.email
  } else if (attrKey === AttrKeys.mobilePhoneNumber) {
    entry.value = v.claim.telephone
  } else if (attrKey === AttrKeys.postalAddress) {
    // TODO: handle this case once agreen on design
    // it has this schema: {streetAddress, postalCode, addressLocality, addressCountry}
  }

  return Array.isArray(initialValue) ? [...initialValue, entry] : [entry]
}

export const getClaim = (attributeKey: AttrKeys, value: string) => {
  switch (attributeKey) {
    case AttrKeys.name:
      const [givenName, familyName] = value.split(' ')
      return { givenName, familyName: familyName || '' }
    case AttrKeys.emailAddress:
      return { email: value }
    case AttrKeys.mobilePhoneNumber:
      return { telephone: value }
  }
}
