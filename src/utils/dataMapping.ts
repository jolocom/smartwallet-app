import { AttrKeys, AttrTypes } from '~/types/attributes'
import { AttributeI } from '~/modules/attributes/types'
import {
  FlowType,
  CredentialRequestFlowState,
  CredentialOfferFlowState,
  AuthenticationFlowState,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'

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
  } else if (attrKey === AttrKeys.email) {
    entry.value = v.claim.email
  } else if (attrKey === AttrKeys.number) {
    entry.value = v.claim.number
  }

  return Array.isArray(initialValue) ? [...initialValue, entry] : [entry]
}

interface InitiatorI {
  did: string
}

interface SummaryI<T> {
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
  const credentials = summary.state.constraints[0].requestedCredentialTypes.reduce(
    (acc, v) => {
      const credType: AttrKeys | string = v[1]
      if (credType in AttrTypes) {
        acc.self_issued = [...acc.self_issued, credType]
      } else {
        acc.service_issued = [...acc.service_issued, credType]
      }
      return acc
    },
    { service_issued: [] as string[], self_issued: [] as string[] },
  )

  return {
    counterparty: summary.initiator,
    credentials,
  }
}

const mapCredReceiveData = (summary: SummaryI<CredentialOfferFlowState>) => {
  console.log('cred receive')
  console.log({ summary })
  return {
    counterparty: summary.initiator,
    credentials: {
      service_issued: summary.state.offerSummary.map(cred => ({
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
