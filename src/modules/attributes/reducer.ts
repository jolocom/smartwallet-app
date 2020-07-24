import { ActionI } from '~/types/action'
import { AttrsState, AttrActions, AttributeI } from './types'
import { AttrKeys } from '~/types/attributes'

export const initialState = {} as AttrsState<AttributeI>

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.setAttrs:
      return action.payload
    case AttrActions.updateAttrs:
      const {
        attributeKey,
        attribute,
      }: { attributeKey: AttrKeys; attribute: AttributeI } = action.payload
      return {
        ...state,
        [attributeKey]: state[attributeKey]
          ? [...state[attributeKey], attribute]
          : [attribute],
      }
    default:
      return state
  }
}

export default reducer
