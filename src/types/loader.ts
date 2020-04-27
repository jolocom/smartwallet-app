export enum LoaderTypes {
  default,
  error,
  success,
}

export enum LoaderActions {
  dismiss,
  set,
}

export interface LoaderStateI {
  type: LoaderTypes;
  msg: string;
}
