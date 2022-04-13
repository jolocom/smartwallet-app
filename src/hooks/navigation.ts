import {
  useNavigation,
  StackActions,
  useNavigationState,
} from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useDispatch } from 'react-redux'
import { setAppLocked, setLocalAuth } from '~/modules/account/actions'
import { useLayoutEffect } from 'react'

interface NestedSceenI {
  screen?: ScreenNames
}

export const useGoBack = () => {
  const navigation = useNavigation()
  if (navigation.canGoBack()) {
    return () => {
      navigation.goBack()
    }
  }
  return () => {
    throw new Error("Can't go back")
  }
}

export const usePop = () => {
  const navigation = useNavigation()

  return (n: number) => {
    navigation.dispatch(StackActions.pop(n))
  }
}

export const usePopStack = () => {
  const navigation = useNavigation()
  const stackSize = useNavigationState((state) => state.index)

  return () => {
    /**
     * TODO: this is not a reliable way to pop eid stack;
     * because on different eID screens the state is different:
     * i.e. on Interaction Sheet the state contains MainTabs and eID as
     * routes, thus poping to the top (to the MainTabs) and then
     * pop (at this point there is only one route MainTabs) results in an error
     * becuase popu clears the route state
     */
    //NOTE: pops to the first screen of the stack, if not already there
    if (stackSize !== 0) navigation.dispatch(StackActions.popToTop())
    navigation.dispatch(StackActions.pop())
  }
}

export const useRedirect = () => {
  const navigation = useNavigation()

  return (
    screenName: ScreenNames,
    params: Record<string, any> & NestedSceenI = {},
  ) => navigation.navigate(screenName, params)
}

export const useReplaceWith = () => {
  const navigation = useNavigation()
  return (
    screenName: ScreenNames,
    params: Record<string, any> & NestedSceenI = {},
  ) => navigation.dispatch(StackActions.replace(screenName, params))
}

export const useRedirectToLoggedIn = () => {
  const dispatch = useDispatch()

  return () => {
    dispatch(setAppLocked(false))
    dispatch(setLocalAuth(true))
  }
}

/* Used to switch between InteractionFlow and InteractionAddCredential screens */
export const useSwitchScreens = (screenToSwitchTo: ScreenNames) => {
  const navigation = useNavigation()

  return <T extends {}>(params?: T) => {
    navigation.goBack()
    setTimeout(() => {
      navigation.navigate(screenToSwitchTo, params)
    }, 500)
  }
}

/*
 * Should be used to dynamically disable gestures for nested stack screens
 */
export const useDangerouslyDisableGestures = () => {
  const navigation = useNavigation()

  useLayoutEffect(() => {
    navigation.setParams({ gestureEnabled: false })
  }, [])
}
