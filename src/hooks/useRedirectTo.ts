import { StackActions, useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

interface NestedSceenI {
  screen?: ScreenNames
}

const useRedirectTo = (
  screenName: ScreenNames,
  params: Record<string, any> & NestedSceenI = {},
) => {
  const navigation = useNavigation()
  const redirectTo = () => navigation.navigate(screenName, params)
  return redirectTo
}

export default useRedirectTo
