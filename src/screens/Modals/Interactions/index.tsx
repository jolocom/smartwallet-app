import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {InteractionScreens} from '~/types/screens';

import Scanner from './Scanner';
import Details from './Details';

const Stack = createStackNavigator();

const Interactions: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={InteractionScreens.Scanner} component={Scanner} />
      <Stack.Screen name={InteractionScreens.Details} component={Details} />
    </Stack.Navigator>
  );
};

export default Interactions;
