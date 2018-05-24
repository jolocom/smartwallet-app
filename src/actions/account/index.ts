import { AnyAction, Dispatch } from 'redux'
// import { navigationActions, genericActions } from 'src/actions/'
// import { BackendMiddleware } from 'src/backendMiddleware'
// import { routeList } from 'src/routeList'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

// TODO Abstract parsing of error messages
export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: any, { backendMiddleware } : any) => {
    // const { storageLib } = backendMiddleware
    // const personas = await storageLib.getPersonas()
  }
}
