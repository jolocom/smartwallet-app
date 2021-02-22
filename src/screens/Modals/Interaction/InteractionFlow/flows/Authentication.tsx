import React from 'react';
import InteractionFooter from './components/InteractionFooter';
import InteractionDescription from './components/InteractionDescription';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';

/* --- Authentication API ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Allow" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

const Authentication = () => {
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo
          source="https://i.pinimg.com/originals/f8/23/73/f8237350ca8f6f0936afcd095767589f.jpg"
        />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      <InteractionFooter submitLabel="Accept" />
    </ContainerBAS>
  )
}


export default Authentication;