import { AnyAction } from 'redux'
import { reject } from 'ramda'
import { Notification } from './types'

export const SCHEDULE_NOTIFICATION = 'SCHEDULE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const SET_ACTIVE_NOTIFICATION = 'SET_ACTIVE_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS'

export type NotificationsState = {
  queue: Notification[],
  active?: Notification | null,
  activeExpiryTs?: number
}

const initialState: NotificationsState = { queue: [], active: null }

export const notificationsReducer = (
  state = initialState,
  action: AnyAction,
): NotificationsState => {
  switch (action.type) {
    case SCHEDULE_NOTIFICATION:
      return { ...state, queue: [...state.queue, action.value] }
    case REMOVE_NOTIFICATION:
      return {
        ...state,
        queue: reject(
          notification => notification.uid === action.value.uid,
          state.queue,
        )
      }
    case SET_ACTIVE_NOTIFICATION:
      return {
        ...state,
        active: action.notification,
        activeExpiryTs: action.expiry
      }
    case CLEAR_NOTIFICATIONS:
      return initialState
    default:
      return state
  }
}
