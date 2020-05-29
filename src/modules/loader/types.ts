export enum LoaderTypes {
  default = 'default',
  error = 'error',
  success = 'success',
}

export enum LoaderActions {
  dismiss,
  set,
}

export interface LoaderStateI {
  type: LoaderTypes | null
  msg: string
}
