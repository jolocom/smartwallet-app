import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';
import {Screens} from '.';

const Entropy: React.FC = () => {
  const redirectToSeedPhrase = useRedirectTo(Screens.SeedPhrase);

  return (
    <ScreenContainer>
      <Header>Entropy</Header>
      <Btn onPress={redirectToSeedPhrase}>Create Identity</Btn>
    </ScreenContainer>
  );
};

export default Entropy;
