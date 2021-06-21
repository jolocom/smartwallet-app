import { ActionI } from '~/types/action'
import { AttributeTypes } from '~/types/credentials'
import {
  AttributesState,
  AttrActions,
  AttributePayloadEdit,
  AttributePayload,
} from './types'

export const initialState: AttributesState = { all: {} }

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.initAttrs: {
      return { ...state, all: action.payload }
    }
    case AttrActions.updateAttrs: {
      const { type, attribute } = action.payload as AttributePayload
      const availableAttr = state.all[type];
      return {
        ...state,
        all: {
          ...state.all,
          [type]: availableAttr ? [...availableAttr, attribute] : [attribute],
        },
      }
    }
    case AttrActions.editAttr: {
      const { type, attribute, id } = action.payload as AttributePayloadEdit
      return {
        ...state,
        all: {
          ...state.all,
          [type]: state.all[type]?.map(c => c.id === id ? attribute : c),
        },
      }
    }
    case AttrActions.deleteAttr: {
      const { type, id }: { type: AttributeTypes; id: string } = action.payload
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
