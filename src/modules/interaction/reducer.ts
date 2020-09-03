import {
  InteractionActions,
  IntermediaryState,
  InteractionStateI,
} from './types'
import { Action } from '~/types/actions'
import { ActionI } from '~/types/action'

const initialState: InteractionStateI = {
  details: {},
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  selectedShareCredentials: {},
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
    case InteractionActions.selectAttr:
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
