import { strings } from '~/translations/strings'

import { LoaderActions, LoaderStateI } from './types'

type Actions = {
  type: LoaderActions
  payload?: any
}

const initialState: LoaderStateI = {
  type: null,
  msg: strings.EMPTY,
}

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      return action.payload
    case LoaderActions.dismiss:
      return initialState
    default:
      return state
  }
}

export default reducer
