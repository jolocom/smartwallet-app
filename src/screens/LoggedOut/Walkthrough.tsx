import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header, {Sizes} from '~/components/Header';
import Btn, {Types} from '~/components/Btn';
import {Screens} from '.';

import useRedirectTo from '~/hooks/useRedirectTo';

const Walkthrough: React.FC = () => {
  const redirectToEntropy = useRedirectTo(Screens.Entropy);
  const redirectToRecovery = useRedirectTo(Screens.Recovery);
  return (
    <ScreenContainer>
      <Header size={Sizes.large}>Walkthrough</Header>
      <Btn onPress={redirectToEntropy}>Get started</Btn>
      <Btn type={Types.secondary} onPress={redirectToRecovery}>
        Need Restore?
      </Btn>
    </ScreenContainer>
  );
};

export default Walkthrough;
