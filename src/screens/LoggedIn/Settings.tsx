import React from 'react';
import {useNavigation} from '@react-navigation/native';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import {Screens} from '../LoggedOut';

const Settings: React.FC = () => {
  const navigation = useNavigation();
  const logout = () =>
    navigation.navigate('LoggedOut', {screen: Screens.Walkthrough});
  return (
    <ScreenContainer>
      <Header>Settings</Header>
      <Btn onPress={logout}>Log out</Btn>
    </ScreenContainer>
  );
};

export default Settings;
