import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'
import { ClaimValues } from '~/modules/attributes/types'
import {
 ClaimKeys,
 IAttributeClaimFieldWithValue,
} from '~/types/credentials'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'

export type TClaimGroups = Record<string, Group>
type TField = Pick<IAttributeClaimFieldWithValue, 'key' | 'value'>

export class Group {
  label: string
  fields: TField[]
  constructor(label: string) {
    this.label = label
    this.fields = []
  }
  public addField(fieldKey: ClaimKeys) {
    this.fields = [...this.fields, { key: fieldKey, value: '' }]
    return this
  }
  public updateFieldValue(fieldKey: ClaimKeys, fieldValue: ClaimEntry) {
    this.fields = this.fields.map(f => f.key === fieldKey ? ({...f, value: fieldValue}) : f)
  }
  public setGroupValues(values: ClaimValues) {
    this.fields = this.fields.map((f) => ({ ...f, value: values[f.key] || '' }))
    return this
  }
}

const managePopulateGroup = (
  groupLabel: string,
  fieldKey: ClaimKeys,
  group?: Group,
) => {
  if (group) {
    group.addField(fieldKey)
    return group
  } else {
    const group = new Group(groupLabel)
    group.addField(fieldKey)
    return group
  }
}

export const getGroupedClaimsForBusinessCard = () => {
  return attributeConfig.ProofOfBusinessCardCredential.fields.reduce<TClaimGroups>(
    (groupes, claim) => {
      switch (claim.key) {
        case ClaimKeys.givenName:
        case ClaimKeys.familyName: {
          const groupName = 'name'
          groupes[groupName] = managePopulateGroup(
            strings.NAME,
            claim.key,
            groupes[groupName],
          )
          break
        }
        case ClaimKeys.email:
        case ClaimKeys.telephone: {
          const groupName = 'contact'
          groupes[groupName] = managePopulateGroup(
            strings.CONTACT_ME,
            claim.key,
            groupes[groupName],
          )
          break
        }
        case ClaimKeys.legalCompanyName: {
          const groupName = 'company'
          groupes[groupName] = managePopulateGroup(
            strings.COMPANY,
            claim.key,
            groupes[groupName],
          )
          break
        }
      }
      return groupes
    },
    {},
  )
}