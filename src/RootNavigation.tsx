import React, {useRef, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoggedOut from '~/screens/LoggedOut';
import LoggedIn from '~/screens/LoggedIn';
import Loader from '~/screens/Modals/Loader';
import Interactions from '~/screens/Modals/Interactions';

import {modalScreenOptions} from '~/utils/styles';
import {ScreenNames} from '~/types/screens';

import {getLoaderMsg} from '~/modules/loader/selectors';

const RootStack = createStackNavigator();

const useLoaderScreenVisibility = () => {
  const ref = useRef(null);

  const loaderMsg = useSelector(getLoaderMsg);

  useEffect(() => {
    if (ref.current) {
      if (loaderMsg) {
        ref.current.navigate(ScreenNames.Loader);
      } else if (!loaderMsg) {
        console.log(ref.current.canGoBack());
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
