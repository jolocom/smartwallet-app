import { AppStateActionType, AppStatusState } from './types'
import { setPopup } from './actions'

const initialState: AppStatusState = {
  isPopup: false,
}

const reducer = (state = initialState, action: ReturnType<typeof setPopup>) => {
  switch (action.type) {
    case AppStateActionType.setPopup:
      return { ...initialState, isPopup: action.payload }
    default:
      return state
  }
}

export default reducer
