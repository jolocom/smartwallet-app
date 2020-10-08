import { StackActions, useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

interface NestedSceenI {
  screen?: ScreenNames
}

const useRedirectTo = (
  screenName: ScreenNames,
  nestedScreen: NestedSceenI = {},
) => {
  const navigation = useNavigation()
  const pushAction = StackActions.push(screenName, nestedScreen)
  const redirectTo = () => navigation.dispatch(pushAction)
  return redirectTo
}

export default useRedirectTo
