import { useNavigation, StackActions } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'

const useReplaceWith = (screenName: ScreenNames) => {
  const navigation = useNavigation()
  return () => navigation.dispatch(StackActions.replace(screenName))
}

export default useReplaceWith
