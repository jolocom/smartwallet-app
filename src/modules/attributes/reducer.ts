import {
  AttributesState,
  AttributePayloadEdit,
  AttributePayload,
  AttrActionType,
} from './types'
import { initAttrs, updateAttrs, editAttr, deleteAttr } from './actions'

export const initialState: AttributesState = { all: {} }

const reducer = (
  state = initialState,
  action: ReturnType<
    typeof initAttrs | typeof updateAttrs | typeof editAttr | typeof deleteAttr
  >,
) => {
  switch (action.type) {
    case AttrActionType.initAttrs: {
      return { ...state, all: action.payload }
    }
    case AttrActionType.updateAttrs: {
      const { type, attribute } = action.payload as AttributePayload
      const availableAttr = state.all[type]
      return {
        ...state,
        all: {
          ...state.all,
          [type]: availableAttr ? [...availableAttr, attribute] : [attribute],
        },
      }
    }
    case AttrActionType.editAttr: {
      const {
        type,
        attribute: editedAttribute,
        id,
      } = action.payload as AttributePayloadEdit
      return {
        ...state,
        all: {
          ...state.all,
          [type]: state.all[type]?.map((stateAttribute) =>
            stateAttribute.id === id ? editedAttribute : stateAttribute,
          ),
        },
      }
    }
    case AttrActionType.deleteAttr: {
      const { type, id } = action.payload
      const typeAttrs = state.all[type]

      if (typeAttrs) {
        return {
          all: {
            ...state.all,
            [type]: typeAttrs.filter((attr) => attr.id !== id),
          },
        }
      }

      return state
    }
    default:
      return state
  }
}

export default reducer
