import { InteractionActions } from './types'

const initialState = {
  interactionId: '',
  interactionSheet: null,
  summary: {},
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case InteractionActions.setInteraction:
      return {
        ...state,
        interactionId: action.payload.interactionId,
        interactionSheet: action.payload.interactionSheet,
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
