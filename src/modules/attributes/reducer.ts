import { ActionI } from '~/types/action'
import { AttributesState, AttrActions, AttributeI } from './types'
import { AttrKeys } from '~/types/attributes'

export const initialState: AttributesState = { all: {} }

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.setAttrs:
      return { ...state, all: action.payload }
    case AttrActions.updateAttrs:
      const {
        attributeKey,
        attribute,
      }: { attributeKey: AttrKeys; attribute: AttributeI } = action.payload
      const value = state.all[attributeKey]
      return {
        ...state,
        all: {
          ...state.all,
          [attributeKey]: value ? [...value, attribute] : [attribute],
        },
      }
    default:
      return state
  }
}

export default reducer
