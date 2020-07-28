import { AttrKeys } from '~/types/attributes'
import { AttributeI } from '~/modules/attributes/types'

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
  } else if (attrKey === AttrKeys.email) {
    entry.value = v.claim.email
  } else if (attrKey === AttrKeys.number) {
    entry.value = v.claim.number
  }

  return Array.isArray(initialValue) ? [...initialValue, entry] : [entry]
}

export const credTypes = {
  email: 'emailAddress',
  number: 'mobilePhoneNumber',
  name: 'name',
}
export const getClaim = (attributeKey: AttrKeys, value: string) => {
  switch (attributeKey) {
    case AttrKeys.name:
      const [givenName, familyName] = value
      return { giveName, familyName }
    case AttrKeys.email:
      return { email: value }
    case AttrKeys.number:
      return { telephone: value }
  }
}
