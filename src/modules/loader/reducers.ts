import { LoaderActions, LoaderState, LoaderTypes } from './types'
import { dismissLoader, setLoader } from './actions'

const initialState: LoaderState = {
  type: LoaderTypes.default,
  msg: '',
  isVisible: false,
}

const reducer = (
  state = initialState,
  action: ReturnType<typeof dismissLoader | typeof setLoader>,
) => {
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
