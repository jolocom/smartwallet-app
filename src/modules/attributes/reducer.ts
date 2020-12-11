import { ActionI } from '~/types/action'
import { AttributesState, AttrActions, AttributePayload } from './types'

export const initialState: AttributesState = { all: {} }

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.initAttrs:
      return { ...state, all: action.payload }
    case AttrActions.updateAttrs:
      const { type, attribute } = action.payload as AttributePayload
      const availableAttr = state.all[type]
      return {
        ...state,
        all: {
          ...state.all,
          [type]: availableAttr ? [...availableAttr, attribute] : [attribute],
        },
      }
    default:
      return state
  }
}

export default reducer
