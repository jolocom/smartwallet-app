import { AttrKeys, ATTR_TYPES } from '~/types/attributes'
import { claimsMetadata } from 'cred-types-jolocom-core'

import { AttributeI } from '~/modules/attributes/types'
import {
  FlowType,
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'

export const fieldNames = {
  [AttrKeys.name]: 'name',
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'number',
  [AttrKeys.postalAddress]: 'address',
}

export const credentialSchemas = Object.keys(claimsMetadata).reduce(
  (acc, v) => {
    const value = v as AttrKeys
    acc[value] = claimsMetadata[value].type[1]
    return acc
  },
  {} as { [key: string]: string },
)

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

interface InitiatorI {
  did: string
}

export interface SummaryI<T> {
  state: T
  initiator: InitiatorI
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

const mapCredReceiveData = (summary: SummaryI<CredentialOfferFlowState>) => {
  return {
    counterparty: summary.initiator,
    credentials: {
      service_issued: summary.state.offerSummary.map((cred) => ({
        type: cred.type,
        invalid: false,
        renderInfo: cred.renderInfo,
      })),
    },
  }
}

export const getMappedInteraction = (interaction: Interaction) => {
  if (interaction.flow.type === FlowType.Authentication) {
    return mapAuthenticationData(
      interaction.getSummary() as SummaryI<AuthenticationFlowState>,
    )
  } else if (interaction.flow.type === FlowType.CredentialShare) {
    return mapCredShareData(
      interaction.getSummary() as SummaryI<CredentialRequestFlowState>,
    )
  } else if (interaction.flow.type === FlowType.CredentialReceive) {
    return mapCredReceiveData(
      interaction.getSummary() as SummaryI<CredentialOfferFlowState>,
    )
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
