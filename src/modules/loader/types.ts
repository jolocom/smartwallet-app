export enum LoaderTypes {
  default = 'default',
  error = 'error',
  success = 'success',
}

export enum LoaderActions {
  dismiss = 'dismissLoader',
  set = 'setLoader',
}

export interface LoaderStateI {
  type: LoaderTypes
  msg: string
  isVisible: boolean
}
