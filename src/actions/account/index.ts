import { AnyAction, Dispatch } from 'redux'
import { navigationActions, genericActions } from 'src/actions/'

export const setDid = (did: string) => {
  return {
    type: 'DID_SET',
    value: did
  }
}

// TODO Abstract parsing of error messages
// TODO Type backend middleware
export const checkIdentityExists = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: any, backendMiddleware : any) => {
    const { storageLib } = backendMiddleware

    try {
      const personas = await storageLib.getPersonas()
      if (!personas.length) {
        return
      }

      dispatch(setDid(personas[0].did))
      dispatch(navigationActions.navigate({
        routeName: 'Identity' 
      }))
    } catch(err) {
      if (err.message.indexOf('no such table') === 0) {
        return
      }

      dispatch(genericActions.showErrorScreen(err))
    }
  }
}
