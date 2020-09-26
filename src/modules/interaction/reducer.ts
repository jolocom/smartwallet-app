import {
  InteractionActions,
  InteractionState,
  IntermediarySheetState,
} from './types'
import { Action } from '~/types/actions'
import { isCredShareDetails } from './guards'

const initialState: InteractionState = {
  details: { flowType: null },
  intermediary: {
    sheetState: IntermediarySheetState.hiding,
    attributeInputKey: null,
  },
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
      if (isCredShareDetails(state.details)) {
        return {
          ...state,
          details: {
            ...state.details,
            selectedCredentials: {
              ...state.details.selectedCredentials,
              ...action.payload,
            },
          },
        }
      }
      return state
    case InteractionActions.setIntermediaryState:
      console.log({
        ...state,
        intermediary: { ...state.intermediary, sheetState: action.payload },
      })
      return {
        ...state,
        intermediary: { ...state.intermediary, sheetState: action.payload },
      }
    case InteractionActions.setAttributeInputKey:
      return {
        ...state,
        ...{ ...state.intermediary, attributeInputKey: action.payload },
      }
    default:
      return state
  }
}

export default reducer
