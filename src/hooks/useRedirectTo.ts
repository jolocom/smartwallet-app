import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

interface NestedSceenI {
  screen?: ScreenNames
}

const useRedirectTo = (
  screenName: ScreenNames,
  nestedScreen: NestedSceenI = {},
) => {
  const navigation = useNavigation()
  const redirectTo = () => navigation.navigate(screenName, nestedScreen)
  return redirectTo
}

export default useRedirectTo
