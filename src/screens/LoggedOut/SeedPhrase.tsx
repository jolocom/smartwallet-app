import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';
import {ScreenNames} from '~/types/screens';

const SeedPhrase: React.FC = () => {
  const redirectToRepeatSeedPhrase = useRedirectTo(
    ScreenNames.SeedPhraseRepeat,
  );

  return (
    <ScreenContainer>
      <Header>Seed Phrase</Header>
      <Btn onPress={redirectToRepeatSeedPhrase}>Repeat Seed Phrase</Btn>
    </ScreenContainer>
  );
};

export default SeedPhrase;
