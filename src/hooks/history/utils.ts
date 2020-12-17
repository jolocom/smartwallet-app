import moment from 'moment'
import { IInteractionWithSection, IHistorySection } from './types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { FlowType } from '@jolocom/sdk'

export const filterUniqueById = (array: IInteractionWithSection[]) =>
  Array.from(new Set(array.map((i) => i.id))).map((i) => {
    const { id, ...rest } = array.find((id) => i === id.id)!
    return {
      id: i,
      ...rest,
    }
  })

export const getDateSection = (date: Date) =>
  moment(date).calendar(null, {
    sameDay: '[Today]',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'DD/MM/YYYY',
  })

export const groupBySection = (array: IInteractionWithSection[]) => {
  const groupedObj = array.reduce<Record<string, string[]>>((acc, v) => {
    acc[v.section] = acc[v.section] ? [...acc[v.section], v.id] : [v.id]
    return acc
  }, {})

  return Object.keys(groupedObj).map((section) => ({
    section,
    data: groupedObj[section],
  }))
}

export const interactionTypeToFlowType: { [x: string]: FlowType } = {
  [InteractionType.CredentialOfferRequest]: FlowType.CredentialOffer,
  [InteractionType.CredentialOfferResponse]: FlowType.CredentialOffer,
  [InteractionType.CredentialsReceive]: FlowType.CredentialOffer,
  [InteractionType.CredentialRequest]: FlowType.CredentialShare,
  [InteractionType.CredentialResponse]: FlowType.CredentialShare,
  [InteractionType.Authentication]: FlowType.Authentication,
  AuthorizationRequest: FlowType.Authorization,
  AuthorizationResponse: FlowType.Authorization,
}
