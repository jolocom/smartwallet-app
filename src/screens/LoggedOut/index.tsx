import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

export enum Screens {
  Walkthrough = 'Walkthrough',
  Entropy = 'Entropy',
  Recovery = 'Recovery',
  SeedPhrase = 'SeedPhrase',
  SeedPhraseRepeat = 'SeedPhraseRepeat',
}

import Walkthrough from './Walkthrough';
import Entropy from './Entropy';
import Recovery from './Recovery';
import SeedPhrase from './SeedPhrase';
import SeedPhraseRepeat from './SeedPhraseRepeat';

export type StackParamList = {
  [Screens.Walkthrough]: undefined;
  [Screens.Entropy]: undefined;
  [Screens.Recovery]: undefined;
  [Screens.SeedPhrase]: undefined;
  [Screens.SeedPhraseRepeat]: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const LoggedOut: React.FC = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name={Screens.Walkthrough} component={Walkthrough} />
      <Stack.Screen name={Screens.Entropy} component={Entropy} />
      <Stack.Screen name={Screens.Recovery} component={Recovery} />
      <Stack.Screen name={Screens.SeedPhrase} component={SeedPhrase} />
      <Stack.Screen
        name={Screens.SeedPhraseRepeat}
        component={SeedPhraseRepeat}
      />
    </Stack.Navigator>
  );
};

export default LoggedOut;
