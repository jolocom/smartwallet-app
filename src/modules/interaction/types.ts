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
  setIntermediaryState = 'setIntermediaryState',
  setAttributeInputKey = 'setAttributeInputKey',
}

export interface InteractionState {
  interactionId: string
  interactionType: FlowType | null
  summary: any
  attributes: AttrsState<AttributeI>
  selectedAttributes: AttrsState<string>
  intermediaryState: IntermediaryState
  //TODO: change to attribute type
  attributeInputKey: AttrKeys | null
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
