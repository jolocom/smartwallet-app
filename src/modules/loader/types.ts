export enum LoaderTypes {
  default = 'default',
  error = 'error',
  success = 'success',
}

export enum LoaderActionType {
  dismiss = 'dismissLoader',
  set = 'setLoader',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface LoaderActions {
  [LoaderActionType.dismiss]: undefined
  [LoaderActionType.set]: Pick<LoaderState, 'type' | 'msg'>
}

// Dependency between action type and its payload following Action type signature
export type LoaderAction<A extends keyof LoaderActions> = {
  type: A
  payload: LoaderActions[A]
}

export interface LoaderState {
  type: LoaderTypes
  msg: string
  isVisible: boolean
}
