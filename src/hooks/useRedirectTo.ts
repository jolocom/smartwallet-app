import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

const useRedirectTo = (screenName: ScreenNames) => {
  const navigation = useNavigation()
  const redirectTo = () => navigation.navigate(screenName)
  return redirectTo
}

export default useRedirectTo
