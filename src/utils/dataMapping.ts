import {
  AttrKeys,
  ATTR_TYPES,
  UICredential,
  ShareUICredential,
  CredentialSection,
} from '~/types/credentials'
import { claimsMetadata } from 'cred-types-jolocom-core'

import { AttributeI } from '~/modules/attributes/types'
import {
  FlowType,
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { InteractionDetails } from '~/modules/interaction/types'

export const fieldNames = {
  [AttrKeys.name]: 'name',
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'number',
  [AttrKeys.postalAddress]: 'address',
}

export const isCredentialAttribute = (cred: SignedCredential) =>
  Object.values(credentialSchemas).indexOf(cred.type[1]) > -1

export const credentialSchemas = Object.keys(claimsMetadata).reduce<{
  [key: string]: string
}>((acc, v) => {
  const value = v as AttrKeys
  acc[value] = claimsMetadata[value].type[1]
  return acc
}, {})

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

export interface SummaryI<T> {
  state: T
  initiator: IdentitySummary
}

const mapAuthenticationData = (summary: SummaryI<AuthenticationFlowState>) => {
  return {
    counterparty: summary.initiator,
    description: summary.state.description,
  }
}

// TODO: once Authorization is available
// const mapAuthorizationData = (summary) => {
//   return {
//     description: '',
//     action: '',
//     image: ''
//   }
// }

const mapCredShareData = (summary: SummaryI<CredentialRequestFlowState>) => {
  const credentials = summary.state.constraints[0].requestedCredentialTypes.reduce<{
    service_issued: string[]
    self_issued: string[]
  }>(
    (acc, v) => {
      const credType: AttrKeys | string = v[1]
      if (credType in ATTR_TYPES) {
        acc.self_issued = [...acc.self_issued, credType]
      } else {
        acc.service_issued = [...acc.service_issued, credType]
      }
      return acc
    },
    { service_issued: [], self_issued: [] },
  )

  return {
    counterparty: summary.initiator,
    credentials,
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
    // TODO: to update once available
    return {}
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
