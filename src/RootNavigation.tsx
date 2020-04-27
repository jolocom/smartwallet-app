import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoggedOut from '~/screens/LoggedOut';
import LoggedIn from '~/screens/LoggedIn';
import Loader from '~/screens/Modals/Loader';
import Interactions from '~/screens/Modals/Interactions';

import {modalScreenOptions} from '~/utils/styles';
import {ScreenNames} from '~/types/screens';

const RootStack = createStackNavigator();

const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer>
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
