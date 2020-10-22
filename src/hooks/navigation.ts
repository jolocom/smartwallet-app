import { useNavigation, StackActions } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useDispatch } from 'react-redux'
import { setLocalAuth } from '~/modules/account/actions'

export const useNavigateBack = () => {
  const navigation = useNavigation()
  return navigation.goBack
}

interface NestedSceenI {
  screen?: ScreenNames
}

export const useRedirectTo = (
  screenName: ScreenNames,
  params: Record<string, any> & NestedSceenI = {},
) => {
  const navigation = useNavigation()
  const redirectTo = () => navigation.navigate(screenName, params)
  return redirectTo
}

export const useReplaceWith = (screenName: ScreenNames) => {
  const navigation = useNavigation()
  return () => navigation.dispatch(StackActions.replace(screenName))
}

export const useRedirectToLoggedIn = () => {
  const dispatch = useDispatch()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.Tabs)

  return () => {
    dispatch(setLocalAuth(true))
    redirectToLoggedIn()
  }
}
