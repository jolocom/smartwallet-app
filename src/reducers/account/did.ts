import { AnyAction } from 'redux'
import { DidState } from 'src/reducers/account/'

const initialState: DidState = {
  did: '',
  isLocalAuthSet: false,
  isLocalAuthVisible: false,
  isPopup: false,
  isAppLocked: true,
}

export const did = (state = initialState, action: AnyAction): DidState => {
  switch (action.type) {
    case 'DID_SET':
      return {
        ...state,
        did: action.value,
      }
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
      }
    case 'UNLOCK_APP':
      return {
        ...state,
        isAppLocked: false,
      }
    default:
      return state
  }
}
