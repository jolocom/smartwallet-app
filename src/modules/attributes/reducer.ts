import { ActionI } from '~/types/action'
import { AttrsState, AttrActions, Attrs, AttributeI } from './types'

export const initialState = {} as AttrsState<AttributeI>

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.setAttrs:
      return action.payload
    case AttrActions.updateAttrs:
      const {
        attributeKey,
        attribute,
      }: { attributeKey: Attrs; attribute: AttributeI } = action.payload
      return { ...state, [attributeKey]: [...state[attributeKey], attribute] }
    default:
      return state
  }
}

export default reducer
