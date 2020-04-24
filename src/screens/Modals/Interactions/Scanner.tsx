import React from 'react';

import Btn from '~/components/Btn';
import Header from '~/components/Header';

import useRedirectTo from '~/hooks/useRedirectTo';
import {InteractionScreens} from '~/types/screens';
import ScreenContainer from '~/components/ScreenContainer';

const Scanner: React.FC = () => {
  const showInteractionDetails = useRedirectTo(InteractionScreens.Details);

  return (
    <ScreenContainer>
      <Header>Scanner</Header>
      <Btn onPress={showInteractionDetails}>Scan</Btn>
    </ScreenContainer>
  );
};

export default Scanner;
