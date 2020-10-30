import createAction from '~/utils/createAction'
import { ToastsActions } from './types'

export const scheduleToast = createAction(ToastsActions.scheduleToast)
export const removeToast = createAction(ToastsActions.removeToast)
export const setActiveToast = createAction(ToastsActions.setActiveToast)
export const clearToasts = createAction(ToastsActions.clearToasts)
export const setActiveFilter = createAction(ToastsActions.setActiveFilter)
