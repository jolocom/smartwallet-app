import { AnyAction, Dispatch } from 'redux'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: any, { backendMiddleware } : any) => {
    const { storageLib } = backendMiddleware
    const personas = await storageLib.getPersonas()
  }
}
