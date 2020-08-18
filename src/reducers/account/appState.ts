import { AnyAction } from 'redux'
import { AppState } from 'src/reducers/account/'

const initialState: AppState = {
  isLocalAuthSet: false,
  isLocalAuthVisible: false,
  isPopup: false,
  isAppLocked: true,
  isLockVisible: true,
}

export const appState = (state = initialState, action: AnyAction): AppState => {
  switch (action.type) {
    case 'SET_LOCAL_AUTH':
      return {
        ...state,
        isLocalAuthSet: true,
      }
    case 'OPEN_LOCAL_AUTH':
      return {
        ...state,
        isLocalAuthVisible: true,
      }
    case 'CLOSE_LOCAL_AUTH':
      return {
        ...state,
        isLocalAuthVisible: false,
      }
    case 'SET_POPUP':
      return {
        ...state,
        isPopup: action.payload,
      }
    case 'LOCK_APP':
      return {
        ...state,
        isAppLocked: true,
        isLockVisible: true,
      }
    case 'UNLOCK_APP':
      return {
        ...state,
        isAppLocked: false,
        isLockVisible: false,
      }
    case 'CLOSE_LOCK':
      return {
        ...state,
        isLockVisible: false,
      }
    case 'OPEN_LOCK':
      return {
        ...state,
        isLockVisible: true,
      }
    default:
      return state
  }
}
