import createAction from '~/utils/createAction'
import { AppStateActions } from './types'

export const setPopup = createAction<boolean>(AppStateActions.setPopup)
