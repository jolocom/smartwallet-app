import { AnyAction } from 'redux'
import { reject } from 'ramda'
import { Notification } from './types'

export const SCHEDULE_NOTIFICATION = 'SCHEDULE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS'

export type NotificationsState = Notification[]

const initialState: NotificationsState = []

export const notificationsReducer = (
  state = initialState,
  action: AnyAction,
): NotificationsState => {
  switch (action.type) {
    case SCHEDULE_NOTIFICATION:
      console.log(state)
      return [...state, action.value]
    case REMOVE_NOTIFICATION:
      return reject(
        notification => notification.uid === action.value.uid,
        state,
      )
    case CLEAR_NOTIFICATIONS:
      return initialState
    default:
      return state
  }
}
