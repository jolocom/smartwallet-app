import { navigationActions } from 'src/actions/'
import { routeList } from 'src/routeList'
import * as loading from 'src/actions/registration/loadingStages'
import { setDid } from 'src/actions/account'
import { ThunkAction } from 'src/store'
import { navigatorResetHome } from '../navigation'

export const setLoadingMsg = (loadingMsg: string) => ({
  type: 'SET_LOADING_MSG',
  value: loadingMsg,
})

export const setIsRegistering = (value: boolean) => ({
  type: 'SET_IS_REGISTERING',
  value,
})

export const submitEntropy = (
  encodedEntropy: string,
): ThunkAction => dispatch => {
  dispatch(
    navigationActions.navigate({
      routeName: routeList.RegistrationProgress,
    }),
  )

  return dispatch(createIdentity(encodedEntropy))
}

export const createIdentity = (encodedEntropy: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // This is a just-in-case check.... maybe multiple button taps or a redraw or
  // something
  const isRegistering = getState().registration.loading.isRegistering
  if (isRegistering) {
    return dispatch(
      navigationActions.navigate({
        routeName: routeList.RegistrationProgress,
      }),
    )
  }

  dispatch(setIsRegistering(true))

  dispatch(setLoadingMsg(loading.loadingStages[0]))
  await backendMiddleware.setEntropy(encodedEntropy)

  dispatch(setLoadingMsg(loading.loadingStages[1]))
  await backendMiddleware.fuelKeyWithEther()

  dispatch(setLoadingMsg(loading.loadingStages[2]))
  const identity = await backendMiddleware.createIdentity()

  dispatch(setDid(identity.did))
  dispatch(setLoadingMsg(loading.loadingStages[3]))
  dispatch(setIsRegistering(false))

  return dispatch(navigatorResetHome())
}
