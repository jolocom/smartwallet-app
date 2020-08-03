import {
  InteractionActions,
  IntermediaryState,
  InteractionStateI,
  AuthenticationDetailsI,
  AuthorizationDetailsI,
  CredShareI,
  CredReceiveI,
} from './types'
import { Action } from '~/types/actions'
import { ActionI } from '~/types/action'

const initialState: InteractionStateI<
  AuthenticationDetailsI | AuthorizationDetailsI | CredShareI | CredReceiveI
> = {
  details: {
    id: '',
    flowType: null,
    counterparty: {
      did: '',
    },
    description: '',
    image: '',
    action: '',
    credentials: {
      self_issued: [],
      service_issued: [],
    },
  },
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  attributes: {},
  attributesToShare: {},
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
    case InteractionActions.setInteractionAttributes:
      return { ...state, attributes: action.payload }
    case InteractionActions.setAttributesToShare:
      return { ...state, attributesToShare: action.payload }
    case InteractionActions.selectAttr:
      return onSelectAttr(state, action)
    case InteractionActions.setIntermediaryState:
      return { ...state, intermediaryState: action.payload }
    case InteractionActions.setAttributeInputKey:
      return { ...state, attributeInputKey: action.payload }
    default:
      return state
  }
}

const onSelectAttr = (
  state: InteractionStateI<CredShareI>,
  action: ActionI<InteractionActions>,
) => {
  const updatedSelectedAttrs = { [action.payload.attrKey]: action.payload.id }

  return {
    ...state,
    selectedAttributes: {
      ...state.selectedAttributes,
      ...updatedSelectedAttrs,
    },
  }
}

export default reducer
