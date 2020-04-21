import {useNavigation} from '@react-navigation/native';
import {Screens} from '~/screens/LoggedOut';

const useRedirectTo = (screenName: Screens) => {
  const navigation = useNavigation();
  const redirectTo = () => navigation.navigate(screenName);
  return redirectTo;
};

export default useRedirectTo;
