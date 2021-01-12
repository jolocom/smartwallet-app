import moment from 'moment'
import { IPreLoadedInteraction, IHistorySection } from '~/types/records'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { FlowType } from '@jolocom/sdk'

export const filterUniqueById = (array: IPreLoadedInteraction[]) =>
  Array.from(new Set(array.map((i) => i.id))).map((i) => {
    const { id, ...rest } = array.find((interact) => i === interact.id)!
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

export const groupBySection = (
  array: IPreLoadedInteraction[],
): IHistorySection[] => {
  const groupedObj = array.reduce<Record<string, string[]>>((acc, v) => {
    acc[v.section] = acc[v.section] ? [...acc[v.section], v.id] : [v.id]
    return acc
  }, {})

  return Object.keys(groupedObj).map((title) => ({
    title,
    data: groupedObj[title],
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
