import { useNavigation } from '@react-navigation/native'

const useNavigateBack = () => {
  const navigation = useNavigation()
  return navigation.goBack
}

export default useNavigateBack
