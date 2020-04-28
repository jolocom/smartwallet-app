import React from 'react';
import {useDispatch} from 'react-redux';

import {setLoader} from '~/modules/loader/actions';
import {LoaderTypes} from '~/modules/loader/types';

import ScreenContainer from '~/components/ScreenContainer';
import Header, {HeaderSizes} from '~/components/Header';
import Btn from '~/components/Btn';

import useRedirectTo from '~/hooks/useRedirectTo';
import {ScreenNames} from '~/types/screens';
import {LoaderMsgs} from '~/translations/strings';

const Claims: React.FC = () => {
  const dispatch = useDispatch();
  const openLoader = () => {
    dispatch(
      setLoader({
        type: LoaderTypes.default,
        msg: LoaderMsgs.MATCHING,
      }),
    );
  };

  const openScanner = useRedirectTo(ScreenNames.Interactions);

  return (
    <ScreenContainer>
      <Header size={HeaderSizes.large}>Claims</Header>
      <Btn onPress={openLoader}>Open loader</Btn>
      <Btn onPress={openScanner}>Open scanner</Btn>
    </ScreenContainer>
  );
};

export default Claims;
