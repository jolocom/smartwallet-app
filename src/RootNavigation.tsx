import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

import LoggedOut from '~/screens/LoggedOut';

import {modalScreenOptions} from '~/utils/styles';

const RootStack = createStackNavigator();

const RootNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        headerMode="none"
        mode="modal"
        screenOptions={modalScreenOptions}>
        <RootStack.Screen name="LoggedOut" component={LoggedOut} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
