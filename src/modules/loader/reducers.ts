import { LoaderActionType, LoaderState, LoaderTypes } from './types'
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
    case LoaderActionType.set:
      return { ...action.payload, isVisible: true }
    case LoaderActionType.dismiss:
      return initialState
    default:
      return state
  }
}

export default reducer
