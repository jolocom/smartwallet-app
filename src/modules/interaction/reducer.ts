import {
  InteractionActions,
  IntermediaryState,
  InteractionState,
} from './types'
import { Action } from '~/types/actions'

const initialState: InteractionState = {
  details: { flowType: null },
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  selectedShareCredentials: {}, // this is where the credential id's are collected when the user selects the credentials
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteractionDetails:
      return { ...state, details: { ...state.details, ...action.payload } }
    case InteractionActions.resetInteraction:
      return initialState
    case InteractionActions.selectShareCredential:
      return {
        ...state,
        selectedShareCredentials: {
          ...state.selectedShareCredentials,
          ...action.payload,
        },
      }
    case InteractionActions.setIntermediaryState:
      return { ...state, intermediaryState: action.payload }
    case InteractionActions.setAttributeInputKey:
      return { ...state, attributeInputKey: action.payload }
    default:
      return state
  }
}

export default reducer
