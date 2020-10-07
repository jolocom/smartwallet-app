import {
  AttrKeys,
  ATTR_TYPES,
  UICredential,
  ShareUICredential,
} from '~/types/credentials'
import { claimsMetadata } from 'cred-types-jolocom-core'
import {
  FlowType,
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/interactionManager/interaction'
import { IdentitySummary } from '@jolocom/sdk/js/types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

import { AttributeI } from '~/modules/attributes/types'

//TODO: move to `~/types/credentials`
export const fieldNames = {
  [AttrKeys.name]: 'name',
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'number',
  [AttrKeys.postalAddress]: 'address',
}

export const isTypeAttribute = (type: string) =>
  Object.values(credentialSchemas).includes(type)

export const isCredentialAttribute = (cred: SignedCredential) =>
  Object.values(credentialSchemas).indexOf(cred.type[1]) > -1

export const credentialSchemas = Object.keys(claimsMetadata).reduce<
  Record<string, string>
>((acc, v) => {
  const value = v as AttrKeys
  acc[value] = claimsMetadata[value].type[1]
  return acc
}, {})

//TODO: move to ~/types/credentials
type InitialEntryValueT = undefined | AttributeI[]
export interface CredentialI {
  id: string
  claim: Record<string, string>
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

interface SummaryI<T> {
  state: T
  initiator: IdentitySummary
}

const mapAuthenticationData = (summary: SummaryI<AuthenticationFlowState>) => {
  return {
    counterparty: summary.initiator,
    description: summary.state.description,
  }
}

const mapAuthorizationData = (summary: SummaryI<AuthorizationFlowState>) => {
  return {
    counterparty: summary.initiator,
    ...summary.state,
  }
}

const mapCredShareData = (summary: SummaryI<CredentialRequestFlowState>) => {
  const credentials = summary.state.constraints[0].requestedCredentialTypes.reduce<{
    requestedCredentials: string[]
    requestedAttributes: string[]
  }>(
    (acc, v) => {
      const credType: AttrKeys | string = v[1]
      if (credType in ATTR_TYPES) {
        acc.requestedAttributes = [...acc.requestedAttributes, credType]
      } else {
        acc.requestedCredentials = [...acc.requestedCredentials, credType]
      }
      return acc
    },
    { requestedCredentials: [], requestedAttributes: [] },
  )

  return {
    counterparty: summary.initiator,
    ...credentials,
    selectedCredentials: {},
  }
}

// TODO: have proper types for all the mapped interactions
const mapCredOfferData = (summary: SummaryI<CredentialOfferFlowState>) => {
  return {
    counterparty: summary.initiator,
    credentials: {
      service_issued: summary.state.offerSummary.map(
        ({ renderInfo, type }) => ({
          type,
          renderInfo,
          issuer: summary.initiator,
          invalid: false,
        }),
      ),
    },
  }
}

export const getMappedInteraction = (interaction: Interaction) => {
  const summary = interaction.getSummary()
  if (interaction.flow.type === FlowType.Authentication) {
    return mapAuthenticationData(summary as SummaryI<AuthenticationFlowState>)
  } else if (interaction.flow.type === FlowType.CredentialShare) {
    return mapCredShareData(summary as SummaryI<CredentialRequestFlowState>)
  } else if (interaction.flow.type === FlowType.CredentialOffer) {
    return mapCredOfferData(summary as SummaryI<CredentialOfferFlowState>)
  } else if (interaction.flow.type === FlowType.Authorization) {
    return mapAuthorizationData(summary as SummaryI<AuthorizationFlowState>)
  }
}

export const getClaim = (attributeKey: AttrKeys, value: string) => {
  switch (attributeKey) {
    case AttrKeys.name:
      const [givenName, ...familyName] = value.split(' ')

      return {
        givenName,
        familyName: familyName.length ? familyName.join(' ') : '',
      }
    case AttrKeys.emailAddress:
      return { email: value }
    case AttrKeys.mobilePhoneNumber:
      return { telephone: value }
  }
}

export const uiCredentialToShareCredential = (
  cred: UICredential,
): ShareUICredential => {
  const { claim, ...shareCred } = cred
  return shareCred
}
