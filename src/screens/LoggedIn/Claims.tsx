import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';
import {ScreenNames} from '~/types/screens';

const Claims: React.FC = () => {
  const openLoader = useRedirectTo(ScreenNames.Loader);
  const openScanner = useRedirectTo(ScreenNames.Interactions);

  return (
    <ScreenContainer>
      <Header>Claims</Header>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  );
};

export default Claims;
