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
      const availableAttr = state.all[type]
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
      const updatedAttrsOfType =
        state.all[type]?.filter((a) => a.id !== id) || []
      return {
        ...state,
        all: {
          ...state.all,
          [action.payload.type]: [...updatedAttrsOfType, attribute],
        },
      }
    }
    case AttrActions.deleteAttr: {
      const { type } = action.payload
      if (type === AttributeTypes.businessCard) {
        const { ProofOfBusinessCardCredential, ...rest } = state.all
        return { all: rest }
      } else {
        // TODO: handle when working on SIC that are not BC
        return state
      }
    }
    default:
      return state
  }
}

export default reducer
