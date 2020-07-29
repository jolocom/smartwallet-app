import { InteractionActions, IntermediaryState } from './types'
import { Action } from '~/types/actions'
import { ActionI } from '~/types/action'

const initialState = {
  id: '',
  flowType: null,
  intermediaryState: IntermediaryState.absent,
  attributeInputKey: null,
  attributes: {},
  selectedAttributes: {},

  description: '',
  image: '',
  action: '',
  credentials: {
    self_issued: [],
    service_issued: [],
    invalid: [],
  },
}

const reducer = (
  state = initialState,
  action: Action<InteractionActions, any>,
) => {
  switch (action.type) {
    case InteractionActions.setInteractionIdAndType:
      const { id, flowType } = action.payload
      return { ...state, id, flowType }
    case InteractionActions.setInteractionDetails:
      return { ...state, ...action.payload }
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

const onSelectAttr = (state, action: ActionI<InteractionActions>) => {
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
