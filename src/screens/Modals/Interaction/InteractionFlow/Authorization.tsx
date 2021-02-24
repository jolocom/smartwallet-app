import React from 'react';
import InteractionFooter from './components/InteractionFooter';
import InteractionDescription from './components/InteractionDescription';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';
import InteractionImage from './components/InteractionImage';
import useAuthzSubmit from '~/hooks/interactions/useAuthzSubmit';

/*
  {
    action: string,
    description: string
    image: string
  }
*/

const Authorization = () => {
  const handleSubmit = useAuthzSubmit();
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      <InteractionImage />
      <InteractionFooter onSubmit={handleSubmit} />
    </ContainerBAS>
  )
}


export default Authorization;