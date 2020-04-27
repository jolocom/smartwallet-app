import React, {useEffect} from 'react';
import {BackHandler} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import Paragraph from '~/components/Paragraph';
import ScreenContainer from '~/components/ScreenContainer';
import {dismissLoader} from '~/modules/loader/actions';

import Btn, {BtnTypes} from '~/components/Btn';
import {getLoaderMsg} from '~/modules/loader/selectors';

const disableBackBtn = () => true;

const Loader: React.FC = () => {
  const dispatch = useDispatch();
  const loaderMsg = useSelector(getLoaderMsg);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      disableBackBtn,
    );
    return () => backHandler.remove();
  }, []);

  const closeLoaderModal = () => {
    dispatch(dismissLoader());
  };

  return (
    <ScreenContainer isTransparent>
      <Btn type={BtnTypes.secondary} onPress={closeLoaderModal}>
        Close
      </Btn>
      <Paragraph>{loaderMsg}</Paragraph>
    </ScreenContainer>
  );
};

export default Loader;
