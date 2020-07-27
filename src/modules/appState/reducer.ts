import { AppStateActions, AppStatusState } from './types'
import { Action } from '~/types/actions'

const initialState: AppStatusState = {
  isPopup: false,
}

const reducer = (
  state = initialState,
  action: Action<AppStateActions, boolean>,
) => {
  switch (action.type) {
    case AppStateActions.setPopup:
      return { ...initialState, isPopup: action.payload }
    default:
      return state
  }
}

export default reducer
