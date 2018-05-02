import { AnyAction, Dispatch } from 'redux'
import { navigationActions } from 'src/actions/'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: any, { backendMiddleware } : any) => {
    const { storageLib } = backendMiddleware
    try {
      const personas = await storageLib.getPersonas()
      if (personas.length > 1) {
        // HANDLE
      }

      dispatch(setDid(personas[0].did))
      dispatch(navigationActions.navigate({
        routeName: 'Identity' 
      }))
      
    } catch(err) {
      console.log(err)
      console.log('No identity found.')
    }
  }
}
