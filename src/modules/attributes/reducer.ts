import { ActionI } from '~/types/action'
import { AttrsState, AttrActions } from './types'

export const initialState: AttrsState<string> = {}

const reducer = (state = initialState, action: ActionI<AttrActions>) => {
  switch (action.type) {
    case AttrActions.setAttrs:
      return action.payload
    case AttrActions.updateAttrs:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export default reducer
