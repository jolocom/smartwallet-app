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

export const groupBySection = (interactions: IInteractionWithSection[]) =>
  interactions.reduce<IHistorySection[]>((acc, v) => {
    const section = acc.find((s) => s.section === v.section) || {
      section: v.section,
      data: [],
    }
    const filteredAcc = acc.filter((s) => s.section !== v.section)
    section.data.push(v.id)
    filteredAcc.push(section)
    return filteredAcc
  }, [])

export const interactionTypeToFlowType: { [x: string]: FlowType } = {
  [InteractionType.CredentialOfferRequest]: FlowType.CredentialOffer,
  [InteractionType.CredentialOfferResponse]: FlowType.CredentialOffer,
  [InteractionType.CredentialsReceive]: FlowType.CredentialOffer,
  [InteractionType.CredentialRequest]: FlowType.CredentialShare,
  [InteractionType.CredentialResponse]: FlowType.CredentialShare,
  [InteractionType.Authentication]: FlowType.Authentication,
  authorizationRequest: FlowType.Authorization,
  authorizationResponse: FlowType.Authorization,
}
