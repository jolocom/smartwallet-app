import { ActionI } from '~/types/actions'
import { InteractionActions } from './types'

const initialState = {
  interactionId: '',
  interactionType: null,
  summary: {},
}

const reducer = (state = initialState, action: ActionI<InteractionActions>) => {
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
    default:
      return state
  }
}

export default reducer
