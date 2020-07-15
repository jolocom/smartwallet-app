import createAction from '~/utils/createAction'

export enum AppStateActions {
  changePopupState = 'changePopupState',
}

export const changePopupState = createAction(AppStateActions.changePopupState)
