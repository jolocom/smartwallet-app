import React from 'react';
import InteractionFooter from './components/InteractionFooter';
import InteractionDescription from './components/InteractionDescription';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';
import InteractionImage from './components/InteractionImage';

/* --- Authorization API ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.Image />
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Unlock" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

const Authorization = () => {
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      <InteractionImage />
      <Space />
      <InteractionFooter submitLabel="Unlock" />
    </ContainerBAS>
  )
}


export default Authorization;