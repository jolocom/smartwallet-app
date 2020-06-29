import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export enum InteractionsActionTypes {
  setInteractionId = 'setInteractionId',
  setInteractionSheet = 'setInteractionSheet',
  resetInteraction = 'resetInteraction',
}

export interface InteractionsState {
  interactionId: string
  interactionSheet: FlowType | null
}

export interface Action {
  type: InteractionsActionTypes
  payload?: any
}
