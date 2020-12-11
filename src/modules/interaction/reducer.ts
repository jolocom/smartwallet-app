import {
  InteractionActions,
  InteractionState,
  IntermediarySheetState,
} from './types'
import { Action } from '~/types/actions'
import { isCredShareDetails, isCredOfferDetails } from './guards'

const initialState: InteractionState = {
  details: { flowType: null, id: null },
  intermediary: {
    sheetState: IntermediarySheetState.hiding,
    attributeInputType: null,
  },
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteractionDetails:
      return { ...state, details: action.payload }
    case InteractionActions.resetInteraction:
      return initialState
    case InteractionActions.addOfferReceivedCredentials:
      return isCredOfferDetails(state.details)
        ? {
            ...state,
            details: {
              ...state.details,
              credentials: {
                ...state.details.credentials,
                service_issued: action.payload,
              },
            },
          }
        : state
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
      return {
        ...state,
        intermediary: { ...state.intermediary, sheetState: action.payload },
      }
    case InteractionActions.setAttributeInputType:
      return {
        ...state,
        intermediary: {
          ...state.intermediary,
          attributeInputType: action.payload,
        },
      }
    default:
      return state
  }
}

export default reducer
