export enum LoaderMsgs {
  creating = 'Creating your personal secret number',
  matching = 'Matching two instances',
  success = 'Success!',
  failed = 'Failed',
  empty = '',
}

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
  msg: LoaderMsgs;
}
