import createAction from '~/utils/createAction'
import { AppStateAction, AppStateActions, AppStateActionType } from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `appstate` module
function createAppStateAction<K extends keyof AppStateActions>(type: K) {
  return createAction<AppStateAction<K>>(type)
}

export const setPopup = createAppStateAction(AppStateActionType.setPopup)
