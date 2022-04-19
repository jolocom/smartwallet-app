import { InteractionActionType, InteractionState } from './types'
import { isCredShareDetails, isCredOfferDetails } from './ssi/guards'
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
  ssi: { flowType: null, id: null, counterparty: null },
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
      return { ...state, ssi: action.payload }
    case InteractionActionType.resetInteraction:
      return initialState
    case InteractionActionType.updateOfferValidation:
      return isCredOfferDetails(state.ssi)
        ? {
            ...state,
            ssi: {
              ...state.ssi,
              credentials: {
                ...state.ssi.credentials,
                service_issued: action.payload,
              },
            },
          }
        : state
    case InteractionActionType.selectShareCredential:
      if (isCredShareDetails(state.ssi)) {
        return {
          ...state,
          ssi: {
            ...state.ssi,
            selectedCredentials: {
              ...state.ssi.selectedCredentials,
              ...action.payload,
            },
          },
        }
      }
      return state
    case AttrActionType.updateAttrs: {
      const { flowType } = state.ssi
      const { type, attribute } = action.payload as AttributePayload
      if (flowType === null) {
        return state
      }
      /**
       * Upon interaction request,
       * we should populate with newly created attribute
       * attribute property of interaction ssi,
       * because we store separate instance of
       * service and self issued credentials within
       * interaction state.
       */
      if (isCredShareDetails(state.ssi)) {
        const interactionAttributes = state.ssi.attributes[type]
        return {
          ...state,
          ssi: {
            ...state.ssi,
            /**
             * Adding newly create attribute
             */
            attributes: {
              ...state.ssi.attributes,
              [type]: interactionAttributes
                ? [...interactionAttributes, attribute]
                : [attribute],
            },
            /**
             * Selecting newly create attribute
             */
            selectedCredentials: {
              ...state.ssi.selectedCredentials,
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
