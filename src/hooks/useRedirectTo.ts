import {useNavigation} from '@react-navigation/native';
import {Screens} from '~/screens/LoggedOut';
import {Tabs} from '~/screens/LoggedIn';

const useRedirectTo = (screenName: Screens | Tabs | string) => {
  const navigation = useNavigation();
  const redirectTo = () => navigation.navigate(screenName);
  return redirectTo;
};

export default useRedirectTo;
