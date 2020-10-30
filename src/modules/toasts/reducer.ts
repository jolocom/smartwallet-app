import { ToastsState, ToastsActions } from './types'
import { NotificationFilter } from '~/types/toasts'
import { Action } from '~/types/actions'

const initialState: ToastsState = {
  queue: [],
  active: null,
  activeExpiryTs: 0,
  activeFilter: NotificationFilter.all,
}

const toastsReducer = (
  state = initialState,
  action: Action<ToastsActions, any>,
): ToastsState => {
  switch (action.type) {
    case ToastsActions.scheduleToast:
      return { ...state, queue: [...state.queue, action.payload] }
    case ToastsActions.removeToast:
      const queue = state.queue.filter(
        (toast) => toast.id !== action.payload.id,
      )
      return {
        ...state,
        queue,
      }
    case ToastsActions.setActiveToast:
      console.log(action.payload)
      return {
        ...state,
        active: action.payload.notification,
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
