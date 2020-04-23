import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';
import useRedirectTo from '~/hooks/useRedirectTo';
import {ScreenNames} from '~/types/screens';

const Settings: React.FC = () => {
  const logout = useRedirectTo(ScreenNames.LoggedOut);

  return (
    <ScreenContainer>
      <Header>Settings</Header>
      <Btn onPress={logout}>Log out</Btn>
    </ScreenContainer>
  );
};

export default Settings;
