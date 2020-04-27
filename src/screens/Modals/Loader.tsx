import React from 'react';

import Paragraph from '~/components/Paragraph';
import ScreenContainer from '~/components/ScreenContainer';
import {useDispatch, useSelector} from 'react-redux';
import {dismissLoader} from '~/modules/loader/actions';

import Btn, {BtnTypes} from '~/components/Btn';
import {getLoaderMsg} from '~/modules/loader/selectors';

const Loader: React.FC = () => {
  const dispatch = useDispatch();
  const loaderMsg = useSelector(getLoaderMsg);

  const closeLoaderModal = () => {
    dispatch(dismissLoader());
  };

  return (
    <ScreenContainer>
      <Btn type={BtnTypes.secondary} onPress={closeLoaderModal}>
        Close
      </Btn>
      <Paragraph>{loaderMsg}</Paragraph>
    </ScreenContainer>
  );
};

export default Loader;
