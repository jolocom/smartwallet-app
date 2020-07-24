import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState, AttributeI } from '../attributes/types'
import { AttrKeys } from '~/types/attributes'

export enum InteractionActions {
  setInteraction = 'setInteraction',
  setInteractionSummary = 'setInteractionSummary',
  resetInteraction = 'resetInteraction',
  setInteractionAttributes = 'setInteractionAttributes',
  setInitialSelectedAttributes = 'setInitialSelectedAttributes',
  selectAttr = 'selectAttr',
}

export interface InteractionState {
  interactionId: string
  interactionType: FlowType | null
  summary: any
  attributes: AttrsState<AttributeI>
  selectedAttributes: { [key in keyof typeof AttrKeys]: string }
}
