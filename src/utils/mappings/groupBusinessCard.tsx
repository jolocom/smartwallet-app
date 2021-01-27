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

// TODO: make separate class for Fields
export class Group {
  label: string
  fields: TField[]
  constructor(label: string, fields?: TField[]) {
    this.label = label
    this.fields = fields ?? []
  }
  public addField(fieldKey: ClaimKeys) {
    this.fields = [...this.fields, { key: fieldKey, value: '' }]
    return this
  }
  // Update field value individually
  public updateFieldValue(fieldKey: ClaimKeys, fieldValue: ClaimEntry) {
    this.fields = this.fields.map(f => f.key === fieldKey ? ({...f, value: fieldValue}) : f)
  }
  // Update multiple field values at once
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
    (groups, claim) => {
      switch (claim.key) {
        case ClaimKeys.givenName:
        case ClaimKeys.familyName: {
          const groupName = 'name'
          groups[groupName] = managePopulateGroup(
            strings.NAME,
            claim.key,
            groups[groupName],
          )
          break
        }
        case ClaimKeys.email:
        case ClaimKeys.telephone: {
          const groupName = 'contact'
          groups[groupName] = managePopulateGroup(
            strings.CONTACT_ME,
            claim.key,
            groups[groupName],
          )
          break
        }
        case ClaimKeys.legalCompanyName: {
          const groupName = 'company'
          groups[groupName] = managePopulateGroup(
            strings.COMPANY,
            claim.key,
            groups[groupName],
          )
          break
        }
      }
      return groups
    },
    {},
  )
}

export const getUngroupedClaimsForBusinessCard = (groups: TClaimGroups) => {
  return Object.values(groups).reduce<ClaimValues>((ungroupedClaims, val) => {
    val.fields.forEach((field) => {
      ungroupedClaims[field.key] = field.value;
    })
    return ungroupedClaims;
  }, {})
}