import { LoaderActions, LoaderState, LoaderTypes } from './types'

type Actions = {
  type: LoaderActions
  payload?: any
}

const initialState: LoaderState = {
  type: LoaderTypes.default,
  msg: '',
  isVisible: false,
}

const reducer = (state = initialState, action: Actions) => {
  switch (action.type) {
    case LoaderActions.set:
      return { ...action.payload, isVisible: true }
    case LoaderActions.dismiss:
      return initialState
    default:
      return state
  }
}

export default reducer
