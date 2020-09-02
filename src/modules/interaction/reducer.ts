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
  availableAttributesToShare: {},
  selectedAttributes: {},
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
    case InteractionActions.setAvailableAttributesToShare:
      return { ...state, availableAttributesToShare: action.payload }
    case InteractionActions.setSelectedAttributes:
      return { ...state, selectedAttributes: action.payload }
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
  state: InteractionStateI,
  action: ActionI<InteractionActions>,
) => {
  const updatedSelectedAttrs = { [action.payload.attrKey]: action.payload.id }

  return {
    ...state,
    attributesToShare: {
      ...state.attributesToShare,
      ...updatedSelectedAttrs,
    },
  }
}

export default reducer
