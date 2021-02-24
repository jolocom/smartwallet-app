import React from 'react';
import InteractionFooter from './components/InteractionFooter';
import InteractionDescription from './components/InteractionDescription';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';
import InteractionImage from './components/InteractionImage';
import useAuthzSubmit from '~/hooks/interactions/useAuthzSubmit';
import { useSelector } from 'react-redux';
import { getAuthzUIDetails } from '~/modules/interaction/selectors';
import { strings } from '~/translations';

/*
  {
    action: string,
    description: string
    image: string
  }
*/

const Authorization = () => {
  const {
    action,
    imageURL: image,
    description
  } = useSelector(getAuthzUIDetails);

  const handleSubmit = useAuthzSubmit();
  
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle label={strings.WOULD_YOU_LIKE_TO_ACTION(action)} />
      <InteractionDescription />
      <Space />
      <InteractionImage />
      <InteractionFooter onSubmit={handleSubmit} />
    </ContainerBAS>
  )
}


export default Authorization;