import {
  InteractionActions,
  InteractionState,
  IntermediaryState,
} from './types'
import { Action } from '~/types/actions'
import { ActionI } from '~/types/action'

const initialState: InteractionState = {
  interactionId: '',
  interactionType: null,
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  summary: {},
  attributes: {},
  selectedAttributes: {},
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteraction:
      return {
        ...state,
        interactionId: action.payload.interactionId,
        interactionType: action.payload.interactionType,
      }
    case InteractionActions.setInteractionSummary:
      return { ...state, summary: action.payload }
    case InteractionActions.resetInteraction:
      return initialState
    case InteractionActions.setInteractionAttributes:
      return { ...state, attributes: action.payload }
    case InteractionActions.setInitialSelectedAttributes:
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
  state: InteractionState,
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
