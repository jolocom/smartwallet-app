import {useNavigation} from '@react-navigation/native';
import {ScreenNames} from '~/types/screens';

const useRedirectTo = (screenName: ScreenNames | string) => {
  const navigation = useNavigation();
  const redirectTo = () => navigation.navigate(screenName);
  return redirectTo;
};

export default useRedirectTo;
