import React from 'react';

import ScreenContainer from '~/components/ScreenContainer';
import Header from '~/components/Header';
import Btn, {BtnTypes} from '~/components/Btn';
import {ScreenNames} from '~/types/screens';

import useRedirectTo from '~/hooks/useRedirectTo';
import Paragraph from '~/components/Paragraph';
import {Colors} from '~/utils/colors';

const Walkthrough: React.FC = () => {
  const redirectToEntropy = useRedirectTo(ScreenNames.Entropy);
  const redirectToRecovery = useRedirectTo(ScreenNames.Recovery);
  return (
    <ScreenContainer>
      <Header>Walkthrough</Header>
      <Paragraph color={Colors.serenade}>
        Control your own personal information to stay safe online and off. No
        third party tracking and creepy ads.
      </Paragraph>
      <Btn onPress={redirectToEntropy}>Get started</Btn>
      <Btn type={BtnTypes.secondary} onPress={redirectToRecovery}>
        Need Restore?
      </Btn>
    </ScreenContainer>
  );
};

export default Walkthrough;
