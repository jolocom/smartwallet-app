import { ToastsState, ToastsActionType } from './types'
import { ToastFilter } from '~/types/toasts'
import {
  addToQueue,
  removeFromQueue,
  setActiveToast,
  setActiveFilter,
} from './actions'

const initialState: ToastsState = {
  queue: [],
  active: null,
  activeExpiryTs: 0,
  activeFilter: ToastFilter.all,
}

const toastsReducer = (
  state = initialState,
  action: ReturnType<
    | typeof addToQueue
    | typeof removeFromQueue
    | typeof setActiveToast
    | typeof setActiveFilter
  >,
) => {
  switch (action.type) {
    case ToastsActionType.addToQueue:
      return { ...state, queue: [...state.queue, action.payload] }
    case ToastsActionType.removeFromQueue:
      const queue = state.queue.filter(
        (toast) => toast.id !== action.payload.id,
      )
      return {
        ...state,
        queue,
      }
    case ToastsActionType.setActiveToast:
      return {
        ...state,
        active: action.payload.toast,
        activeExpiryTs: action.payload.expiry,
      }
    case ToastsActionType.setActiveFilter:
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
