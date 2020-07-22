import { ActionI } from '~/types/actions'
import { InteractionActions, InteractionState } from './types'

const initialState = {
  interactionId: '',
  interactionType: null,
  summary: {},
  attributes: {},
  selectedAttributes: {},
}

const reducer = (state = initialState, action: ActionI<InteractionActions>) => {
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
