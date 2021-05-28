import { useNavigation, StackActions } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useDispatch } from 'react-redux'
import { setAppLocked, setLocalAuth } from '~/modules/account/actions'

interface NestedSceenI {
  screen?: ScreenNames
}

export const useGoBack = () => {
  const navigation = useNavigation()
  if (navigation.canGoBack()) {
    return navigation.goBack
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

export const useRedirect = () => {
  const navigation = useNavigation()

  return (
    screenName: ScreenNames,
    params: Record<string, any> & NestedSceenI = {},
  ) => navigation.navigate(screenName, params)
}

export const useRedirectTo = (
  screenName: ScreenNames,
  params: Record<string, any> & NestedSceenI = {},
) => {
  const navigation = useNavigation()
  const redirectTo = () => navigation.navigate(screenName, params)
  return redirectTo
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
