import {
  RouteProp,
  ParamListBase,
  NavigationState,
} from '@react-navigation/native'
import { Platform } from 'react-native'

const getNestedStateFromRouteList = <T extends ParamListBase>(
  state: NavigationState<T> | undefined,
) => {
  if (!state) return undefined

  const index = state?.index
  return state?.routes[index].state
}

/*
 * Gets the params of the active screen from the route prop
 */
export const getNestedScreenParams = <T extends ParamListBase>(
  route: RouteProp<T, keyof T> & { state?: NavigationState<T> },
) => {
  const routeState = route.state
  if (!routeState) return null

  let lastState: NavigationState<T> = routeState

  while (getNestedStateFromRouteList(lastState)) {
    // @ts-ignore
    lastState = getNestedStateFromRouteList(lastState)
  }

  const lastRoute = lastState.routes[lastState.index]

  return lastRoute.params
}

/*
 * Gets the @disableGesture param (ATTENTION! not option) of a screen. Should be added
 * to the @screenOptions prop of the @StackNavigator for which the gestures have to be
 * disabled.
 *
 * In order to set the @disableGesture param to a screen, use the @useDangerouslyDisableGestures
 * hook from `~/hooks/navigation`
 */
export const getDangerouslyDisableGestureParamFromRoute = <
  T extends ParamListBase,
>(
  route: RouteProp<T, keyof T> & { state?: NavigationState<T> },
) => {
  const params = getNestedScreenParams(route) as {
    gestureEnabled?: boolean
  }

  return params?.gestureEnabled ?? undefined
}
