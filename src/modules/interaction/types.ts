import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export enum InteractionActions {
  setInteraction = 'setInteraction',
  setInteractionSummary = 'setInteractionSummary',
  resetInteraction = 'resetInteraction',
}

export interface InteractionState {
  interactionId: string
  interactionType: FlowType | null
  summary: any
}
