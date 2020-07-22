import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export enum InteractionActions {
  setInteraction = 'setInteraction',
  setInteractionSummary = 'setInteractionSummary',
  resetInteraction = 'resetInteraction',
  setIntermediaryState = 'setIntermediaryState',
  setAttributeInputKey = 'setAttributeInputKey',
}

export interface InteractionState {
  interactionId: string
  interactionType: FlowType | null
  summary: any
  intermediaryState: IntermediaryState
  //TODO: change to attribute type
  attributeInputKey: string | null
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
