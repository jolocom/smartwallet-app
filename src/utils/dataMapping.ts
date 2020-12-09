import {
  AttrKeys,
  ATTR_TYPES,
  UICredential,
  ShareUICredential,
  AttributeTypes,
} from '~/types/credentials'

import { claimsMetadata } from 'cred-types-jolocom-core'
// FIXME: expose these types from react-native-jolocom
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import {
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { ResolutionFlowState } from '@jolocom/sdk/js/interactionManager/resolutionFlow'
import { FlowType, Interaction, IdentitySummary } from 'react-native-jolocom'

import { AttributeI } from '~/modules/attributes/types'
import { attributeConfig } from '~/config/claims'

export const extractCredentialType = (cred: SignedCredential) =>
  cred.type[cred.type.length - 1]

export const isTypeAttribute = (type: string) =>
  Object.keys(attributeConfig).includes(type)

export const isCredentialAttribute = (cred: SignedCredential) =>
  isTypeAttribute(extractCredentialType(cred))

//TODO: move to ~/types/credentials
type InitialEntryValueT = undefined | AttributeI[]

export const makeAttrEntry = (
  initialValue: InitialEntryValueT,
  cred: SignedCredential,
) => {
  let entry: AttributeI = { id: cred.id, value: '' }
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

const mapResolutionData = (summary: SummaryI<ResolutionFlowState>) => {
  return {
    counterparty: summary.initiator,
    uri: summary.state.request?.uri,
    description: summary.state.request?.description,
  }
}

export const getMappedInteraction = (interaction: Interaction) => {
  const summary = interaction.getSummary()

  switch (interaction.flow.type) {
    case FlowType.Authentication:
      return mapAuthenticationData(summary as SummaryI<AuthenticationFlowState>)
    case FlowType.Authorization:
      return mapAuthorizationData(summary as SummaryI<AuthorizationFlowState>)
    case FlowType.CredentialShare:
      return mapCredShareData(summary as SummaryI<CredentialRequestFlowState>)
    case FlowType.CredentialOffer:
      return mapCredOfferData(summary as SummaryI<CredentialOfferFlowState>)
    case FlowType.Resolution:
      return mapResolutionData(summary as SummaryI<ResolutionFlowState>)
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
