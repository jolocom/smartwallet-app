import {
  AttributeKeys,
  ATTR_TYPES,
  UICredential,
  ShareUICredential,
} from '~/types/credentials'

import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import {
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
  AuthorizationFlowState,
} from '@jolocom/sdk/js/interactionManager/types'
import { ResolutionFlowState } from '@jolocom/sdk/js/interactionManager/resolutionFlow'
import { FlowType, Interaction, IdentitySummary } from 'react-native-jolocom'

import { attributeConfig } from '~/config/claims'

export const extractCredentialType = (cred: SignedCredential) =>
  cred.type[cred.type.length - 1]

export const isTypeAttribute = (type: string) =>
  Object.keys(attributeConfig).includes(type)

export const isCredentialAttribute = (cred: SignedCredential, did: string) =>
  isTypeAttribute(extractCredentialType(cred)) && cred.issuer === did

export const isCredentialDocument = (cred: SignedCredential, did: string) =>
  !isCredentialAttribute(cred, did)

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
      const credType: AttributeKeys | string = v[1]
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

export const uiCredentialToShareCredential = (
  cred: UICredential,
): ShareUICredential => {
  const { claim, ...shareCred } = cred
  return shareCred
}
