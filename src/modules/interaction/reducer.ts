import {
  InteractionActions,
  InteractionState,
  IntermediaryState,
} from './types'
import { Action } from '~/types/actions'

const initialState: InteractionState = {
  interactionId: '',
  interactionType: null,
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  summary: {},
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteraction:
      return {
        ...state,
        interactionId: action.payload.interactionId,
        interactionType: action.payload.interactionType,
      }
    case InteractionActions.setInteractionSummary:
      return { ...state, summary: action.payload }
    case InteractionActions.resetInteraction:
      return initialState
    case InteractionActions.setIntermediaryState:
      return { ...state, intermediaryState: action.payload }
    case InteractionActions.setAttributeInputKey:
      return { ...state, attributeInputKey: action.payload }
    default:
      return state
  }
}

export default reducer
