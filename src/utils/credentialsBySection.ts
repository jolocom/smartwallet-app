import {
  CredentialsBySection,
  CredentialSection,
  BaseUICredential,
  ClaimKeys,
  IAttributeClaimFieldWithValue,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'
import { AttributeI, ClaimValues } from '~/modules/attributes/types'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'

export const getCredentialsBySection = <T extends BaseUICredential>(
  creds: T[],
) => {
  return creds.reduce<CredentialsBySection<T>>(
    (acc, cred) => {
      const section = getCredentialSection(cred)
      acc[section] = [...acc[section], cred]

      return acc
    },
    { documents: [], other: [] },
  )
}

/**
 * Returns @CredentialSection based on the @renderAs property of the Credential Metadata
 */
export const getCredentialSection = <T extends BaseUICredential>(cred: T) =>
  cred.renderInfo && cred.renderInfo.renderAs === CredentialRenderTypes.document
    ? CredentialSection.Documents
    : CredentialSection.Other



// TODO: these declarations should not sit in this file probably 
export type TClaimGroups = Record<string, Group> 
// TODO: this appears too often by now
type TField = Pick<IAttributeClaimFieldWithValue, 'key' | 'value'>

class Group {
  label: string
  fields: TField[]
  constructor(label: string) {
    this.label = label;
    this.fields = []
  }
  public addField(fieldKey: ClaimKeys) {
    this.fields = [...this.fields, {key: fieldKey, value: ''}];
    return this
  }
  public setGroupValues(values: ClaimValues) {
    this.fields = this.fields.map(f => ({...f, value: values[f.key] || ''}))
    return this;
  }
}

const managePopulateGroup = (groupLabel: string, fieldKey: ClaimKeys, group?: Group) => {
  if(group) {
    group.addField(fieldKey)
    return group;
  } else {
    const group = new Group(groupLabel);
    group.addField(fieldKey);
    return group;
  }
} 

export const getGroupedClaimsForBusinessCard = () => {
  return attributeConfig.ProofOfBusinessCardCredential.fields.reduce<TClaimGroups>((groupes, claim) => {
    switch(claim.key) {
      case ClaimKeys.givenName:
      case ClaimKeys.familyName: {
        const groupName = 'name';
        groupes[groupName] = managePopulateGroup(strings.NAME, claim.key, groupes[groupName]);
        break
      }
      case ClaimKeys.email:
      case ClaimKeys.telephone: {
        const groupName = 'contact';
        groupes[groupName] = managePopulateGroup(strings.CONTACT_ME, claim.key, groupes[groupName]);
        break
      }
      case ClaimKeys.legalCompanyName: {
        const groupName = 'company';
        groupes[groupName] = managePopulateGroup(strings.COMPANY, claim.key, groupes[groupName]);
        break
      }   
    }
    return groupes
  }, {})
}
