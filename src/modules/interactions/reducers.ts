import { InteractionsState, InteractionsActionTypes, Action } from './types'

const initialState: InteractionsState = {
  interactionId: '',
  interactionSheet: null,
}

const reducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case InteractionsActionTypes.setInteractionId:
      return { ...state, interactionId: action.payload }
    case InteractionsActionTypes.setInteractionSheet:
      return { ...state, interactionSheet: action.payload }
    case InteractionsActionTypes.resetInteraction:
      return { ...state, interactionSheet: null, interactionId: '' }
    default:
      return state
  }
}

export default reducer
