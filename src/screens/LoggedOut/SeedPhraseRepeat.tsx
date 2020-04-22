import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';

const SeedPhraseRepeat: React.FC = () => {
  const redirectToClaims = useRedirectTo('LoggedIn');

  return (
    <ScreenContainer>
      <Header>Seed Phrase Repeat</Header>
      <Btn onPress={redirectToClaims}>Done</Btn>
    </ScreenContainer>
  );
};

export default SeedPhraseRepeat;
