import { updateAttrs } from '../attributes/actions'
import { AttrActionType, AttributePayload } from '../attributes/types'
import {
  resetInteraction,
  selectShareCredential,
  setDeeplinkConfig,
  setInteractionDetails,
  updateOfferValidation,
} from './actions'
import {
  setAusweisFlowType,
  setAusweisInteractionDetails,
  setAusweisReaderState,
  setAusweisScannerKey,
} from './ausweis/actions'
import { setMdoc } from './mdl/actions'
import { isCredOfferDetails, isCredShareDetails } from './ssi/guards'
import { InteractionActionType, InteractionState } from './types'

const initialState: InteractionState = {
  ssi: { flowType: null, id: null, counterparty: null },
  ausweis: {
    details: null,
    scannerKey: null,
    readerState: null,
    flowType: null,
  },
  deeplinkConfig: {
    redirectUrl: null,
    postRedirect: false,
  },
  mdl: null,
}

const reducer = (
  state = initialState,
  action: ReturnType<
    | typeof setInteractionDetails
    | typeof resetInteraction
    | typeof selectShareCredential
    | typeof updateOfferValidation
    | typeof setDeeplinkConfig
    | typeof updateAttrs
    | typeof setAusweisInteractionDetails
    | typeof setAusweisScannerKey
    | typeof setAusweisReaderState
    | typeof setAusweisFlowType
    | typeof setMdoc
  >,
) => {
  switch (action.type) {
    // NOTE: Generic handlers

    case InteractionActionType.setDeeplinkConfig:
      return { ...state, deeplinkConfig: action.payload }

    // NOTE: SSI handlers

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

    // NOTE: Mdl handlers
    case InteractionActionType.setMdoc:
      return {
        ...state,
        mdl: { ...state.mdl, mdoc: action.payload },
      }

    // NOTE: Ausweis handlers
    case InteractionActionType.setDetails:
      return {
        ...state,
        ausweis: { ...state.ausweis, details: action.payload },
      }
    case InteractionActionType.setScannerKey:
      return {
        ...state,
        ausweis: { ...state.ausweis, scannerKey: action.payload },
      }
    case InteractionActionType.setReaderState:
      return {
        ...state,
        ausweis: { ...state.ausweis, readerState: action.payload },
      }
    case InteractionActionType.setFlowType:
      return {
        ...state,
        ausweis: { ...state.ausweis, flowType: action.payload },
      }
    default:
      return state
  }
}

export default reducer
