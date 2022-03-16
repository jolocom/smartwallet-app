export enum AppStateActionType {
  setPopup = 'setPopup',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface AppStateActions {
  [AppStateActionType.setPopup]: boolean
}

// Dependency between action type and its payload following Action type signature
export type AppStateAction<A extends keyof AppStateActions> = {
  type: A
  payload: AppStateActions[A]
}

export interface AppStatusState {
  isPopup: boolean
}
