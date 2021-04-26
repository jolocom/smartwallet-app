import { InteractionActions, InteractionState } from './types'
import { Action } from '~/types/actions'
import { isCredShareDetails, isCredOfferDetails } from './guards'
import { AttrActions, AttributePayload } from '../attributes/types'
import { AttributeTypes } from '~/types/credentials'

const initialState: InteractionState = {
  details: { flowType: null, id: null },
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions | AttrActions.updateAttrs, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteractionDetails:
      return { ...state, details: action.payload }
    case InteractionActions.resetInteraction:
      return initialState
    case InteractionActions.updateOfferValidation:
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
    case AttrActions.updateAttrs: {
      const {flowType} = state.details;
      const {type, attribute} = action.payload as AttributePayload;
      if(flowType === null || type === AttributeTypes.businessCard) {
        return state;
      }
      if(isCredShareDetails(state.details)) {
        const interactionAttributes = state.details.attributes[type];
        return {
          ...state,
          details: {
            ...state.details,
            attributes: {
              ...state.details.attributes,
              [type]: interactionAttributes ? [...interactionAttributes, attribute] : [attribute]
            }
          }
        }
      }
      return state;
    }
    default:
      return state
  }
}

export default reducer
