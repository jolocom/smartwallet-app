import React from 'react';
import InteractionFooter from './components/InteractionFooter';
import InteractionDescription from './components/InteractionDescription';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';
import useAuthSubmit from '~/hooks/interactions/useAuthSubmit';

const Authentication = () => {
  const handleSubmit = useAuthSubmit()
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo/>
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      <InteractionFooter onSubmit={handleSubmit} />
    </ContainerBAS>
  )
}


export default Authentication;