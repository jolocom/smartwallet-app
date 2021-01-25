import {
  CredentialsBySection,
  CredentialSection,
  BaseUICredential,
  ClaimKeys,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { attributeConfig } from '~/config/claims'
import { strings } from '~/translations'

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
type TClaimGroups = Record<string, Group> 

class Group {
  label: string
  fields: ClaimKeys[]
  constructor(label: string) {
    this.label = label;
    this.fields = []
  }
  public addField(field: ClaimKeys) {
    this.fields = [...this.fields, field];
    return this
  }
}

const managePopulateGroup = (groupLabel: string, field: ClaimKeys, group?: Group) => {
  if(group) {
    group.addField(field)
    return group;
  } else {
    const group = new Group(groupLabel);
    group.addField(field);
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
