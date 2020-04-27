import React, {useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer, NavigationProp} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoggedOut from '~/screens/LoggedOut';
import LoggedIn from '~/screens/LoggedIn';
import Loader from '~/screens/Modals/Loader';
import Interactions from '~/screens/Modals/Interactions';

import {modalScreenOptions} from '~/utils/styles';
import {ScreenNames} from '~/types/screens';

import {getLoaderMsg} from '~/modules/loader/selectors';

type RootStackParamList = {
  [ScreenNames.LoggedOut]: undefined;
  [ScreenNames.LoggedIn]: undefined;
  [ScreenNames.Loader]: undefined;
  [ScreenNames.Interactions]: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

// a listener for loader module state
const useLoaderScreenVisibility = () => {
  const ref = useRef<NavigationProp<RootStackParamList>>(null);

  const loaderMsg = useSelector(getLoaderMsg);

  // as soon as state of loader module changes,
  // 1. if there is a loader msg in state (once setLoader action was dispatched):
  //    navigate to the Loader modal screen
  // 2. if there there is no longer a message in the state (dismissLoader action was dispatched)
  //    navigate back from the Loader modal screen

  // [how to use]
  // a. show Loader screen: dispatch(setLoader({type: LoaderTypes, msg: string}));
  // b. hide Loader screen: dispatch(dismissLoader())
  useEffect(() => {
    if (ref.current) {
      if (loaderMsg) {
        ref.current.navigate(ScreenNames.Loader);
      } else if (!loaderMsg) {
        const canGoBack = ref.current.canGoBack();
        if (canGoBack) {
          ref.current.goBack();
        }
      }
    }
  }, [loaderMsg]);

  return ref;
};

const RootNavigation: React.FC = () => {
  const ref = useLoaderScreenVisibility();

  return (
    <NavigationContainer ref={ref}>
      <RootStack.Navigator
        headerMode="none"
        mode="modal"
        screenOptions={modalScreenOptions}>
        <RootStack.Screen name={ScreenNames.LoggedOut} component={LoggedOut} />
        <RootStack.Screen name={ScreenNames.LoggedIn} component={LoggedIn} />
        <RootStack.Screen name={ScreenNames.Loader} component={Loader} />
        <RootStack.Screen
          name={ScreenNames.Interactions}
          component={Interactions}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
