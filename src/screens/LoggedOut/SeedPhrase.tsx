import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';
import {Screens} from '.';

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(Screens.SeedPhraseRepeat);

  return (
    <ScreenContainer>
      <Header>Seed Phrase</Header>
      <Btn onPress={redirectToRepeatSeedPhrase}>Repeat Seed Phrase</Btn>
    </ScreenContainer>
  );
};

export default SeedPhrase;
