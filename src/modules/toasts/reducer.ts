import { ToastsState, ToastsActions } from './types'
import { ToastFilter } from '~/types/toasts'
import { Action } from '~/types/actions'

const initialState: ToastsState = {
  queue: [],
  active: null,
  activeExpiryTs: 0,
  activeFilter: ToastFilter.all,
}

const toastsReducer = (
  state = initialState,
  action: Action<ToastsActions, any>,
): ToastsState => {
  switch (action.type) {
    case ToastsActions.addToQueue:
      return { ...state, queue: [...state.queue, action.payload] }
    case ToastsActions.removeFromQueue:
      const queue = state.queue.filter(
        (toast) => toast.id !== action.payload.id,
      )
      return {
        ...state,
        queue,
      }
    case ToastsActions.setActiveToast:
      return {
        ...state,
        active: action.payload.toast,
        activeExpiryTs: action.payload.expiry,
      }
    case ToastsActions.clearToasts:
      return initialState
    case ToastsActions.setActiveFilter:
      if (state.activeFilter === action.payload) return state
      return {
        ...state,
        activeFilter: action.payload,
      }
    default:
      return state
  }
}

export default toastsReducer
