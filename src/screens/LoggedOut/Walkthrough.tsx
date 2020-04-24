import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn, {BtnTypes} from '~/components/Btn';
import {ScreenNames} from '~/types/screens';

import useRedirectTo from '~/hooks/useRedirectTo';

const Walkthrough: React.FC = () => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy);
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery);
  return (
    <ScreenContainer>
      <Header>Walkthrough</Header>
      <Btn onPress={redirectToEntropy}>Get started</Btn>
      <Btn type={BtnTypes.secondary} onPress={redirectToRecovery}>
        Need Restore?
      </Btn>
    </ScreenContainer>
  );
};

export default Walkthrough;
