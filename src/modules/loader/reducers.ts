import { strings } from '~/translations/strings'

import { LoaderActions, LoaderTypes, LoaderStateI } from './types'

type Actions = {
  type: LoaderActions
  payload?: any
}

const initialState: LoaderStateI = {
  type: LoaderTypes.default,
  msg: strings.EMPTY,
}

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      console.log({ action })

      return action.payload
    case LoaderActions.dismiss:
      return initialState
    default:
      return state
  }
}

export default reducer
