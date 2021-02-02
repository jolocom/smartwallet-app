import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'
import { ClaimValues } from '~/modules/attributes/types'
import {
  AttributeTypes,
 ClaimKeys,
 IAttributeClaimFieldWithValue,
} from '~/types/credentials'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'

export type TClaimGroups = Record<string, Group>
// export type TField = Pick<IAttributeClaimFieldWithValue, 'key' | 'value'>

export class Group {
  label: string
  fields: IAttributeClaimFieldWithValue[]
  constructor(label: string, fields?: IAttributeClaimFieldWithValue[]) {
    this.label = label
    this.fields = fields ?? []
  }
  public addField(fieldKey: ClaimKeys, type: AttributeTypes) {
    const fieldConfig = attributeConfig[type].fields.find(f => f.key === fieldKey);
    if (!fieldConfig) {
      this.fields = [...this.fields, {key: fieldKey, value: '', label: fieldKey, keyboardOptions: {keyboardType: 'default', autoCapitalize: 'none'}}]
    } else {
      this.fields = [...this.fields, { ...fieldConfig, value: '' }]
    }
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
  type: AttributeTypes,
  group?: Group,
) => {
  if (group) {
    group.addField(fieldKey, type)
    return group
  } else {
    const group = new Group(groupLabel)
    group.addField(fieldKey, type)
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
            AttributeTypes.businessCard,
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
            AttributeTypes.businessCard,
            groups[groupName],
            )
            break
          }
          case ClaimKeys.legalCompanyName: {
            const groupName = 'company'
            groups[groupName] = managePopulateGroup(
              strings.COMPANY,
              claim.key,
              AttributeTypes.businessCard,
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