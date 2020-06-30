import { InteractionActions } from './types'

const initialState = {
  interactionId: '',
  interactionSheet: null,
  summary: {},
}

const reducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case InteractionActions.setInteraction:
      return {
        ...state,
        interactionId: payload.interactionId,
        interactionSheet: payload.interactionSheet,
      }
    case InteractionActions.setInteractionSummary:
      return { ...state, summary: payload }
    case InteractionActions.resetInteraction:
      return initialState
    default:
      return state
  }
}

export default reducer
