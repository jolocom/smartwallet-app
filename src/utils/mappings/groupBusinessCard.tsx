import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'
import { ClaimValues } from '~/modules/attributes/types'
import {
  AttributeTypes,
 ClaimKeys,
 IAttributeClaimFieldWithValue,
 IAttributeConfig,
} from '~/types/credentials'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'

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

export const getGroupedClaimsBusinessCard = (config: IAttributeConfig<IAttributeClaimFieldWithValue>) => {
    return config.fields.reduce<Record<string, IAttributeClaimFieldWithValue[]>>(
    (groups, claim) => {
      switch (claim.key) {
        case ClaimKeys.givenName:
        case ClaimKeys.familyName: {
          groups[strings.NAME] = groups[strings.NAME] ? [...groups[strings.NAME], claim] : [claim];
          break
        }
        case ClaimKeys.email:
          case ClaimKeys.telephone: {
          groups[strings.CONTACT_ME] = groups[strings.CONTACT_ME] ? [...groups[strings.CONTACT_ME], claim] : [claim];
          break
        }
        case ClaimKeys.legalCompanyName: {
          groups[strings.COMPANY] = groups[strings.COMPANY] ? [...groups[strings.COMPANY], claim] : [claim];
          break
        }
      }
      return groups
    },
    {},
  )
}

export const getAttributeConfigWithValues = (type: AttributeTypes, values?: ClaimValues): IAttributeConfig<IAttributeClaimFieldWithValue> => {
  const updatedFields = attributeConfig[type].fields.map(
    (f) => ({
      ...f,
      value: values?.[f.key] || ''
    }),
  )
  return {
    ...attributeConfig[type],
    fields: updatedFields
  }
}