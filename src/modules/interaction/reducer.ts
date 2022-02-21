import { InteractionActionType, InteractionState } from './types'
import { isCredShareDetails, isCredOfferDetails } from './guards'
import { AttrActionType, AttributePayload } from '../attributes/types'
import {
  setInteractionDetails,
  resetInteraction,
  selectShareCredential,
  updateOfferValidation,
  setRedirectUrl,
} from './actions'
import { updateAttrs } from '../attributes/actions'

const initialState: InteractionState = {
  details: { flowType: null, id: null, counterparty: null },
  redirectUrl: null,
}

const reducer = (
  state = initialState,
  action: ReturnType<
    | typeof setInteractionDetails
    | typeof resetInteraction
    | typeof selectShareCredential
    | typeof updateOfferValidation
    | typeof setRedirectUrl
    | typeof updateAttrs
  >,
) => {
  switch (action.type) {
    case InteractionActionType.setInteractionDetails:
      return { ...state, details: action.payload }
    case InteractionActionType.resetInteraction:
      return initialState
    case InteractionActionType.updateOfferValidation:
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
    case InteractionActionType.selectShareCredential:
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
    case AttrActionType.updateAttrs: {
      const { flowType } = state.details
      const { type, attribute } = action.payload as AttributePayload
      if (flowType === null) {
        return state
      }
      /**
       * Upon interaction request,
       * we should populate with newly created attribute
       * attribute property of interaction details,
       * because we store separate instance of
       * service and self issued credentials within
       * interaction state.
       */
      if (isCredShareDetails(state.details)) {
        const interactionAttributes = state.details.attributes[type]
        return {
          ...state,
          details: {
            ...state.details,
            /**
             * Adding newly create attribute
             */
            attributes: {
              ...state.details.attributes,
              [type]: interactionAttributes
                ? [...interactionAttributes, attribute]
                : [attribute],
            },
            /**
             * Selecting newly create attribute
             */
            selectedCredentials: {
              ...state.details.selectedCredentials,
              [type]: attribute.id,
            },
          },
        }
      }
      return state
    }
    case InteractionActionType.setRedirectUrl:
      return { ...state, redirectUrl: action.payload }
    default:
      return state
  }
}

export default reducer
