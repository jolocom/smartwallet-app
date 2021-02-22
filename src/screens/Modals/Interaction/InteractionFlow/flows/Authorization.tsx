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
        <InteractionLogo
          source="https://i.pinimg.com/originals/f8/23/73/f8237350ca8f6f0936afcd095767589f.jpg"
        />
      </LogoContainerBAS>
      <InteractionTitle
        label="Would you like to unlock the scooter?"
      />
      <InteractionDescription
        label="%{service-name} is now ready to grant you access"
        hasWarning={false}
      />
      <Space />
      <InteractionImage source="http://www.pngmart.com/files/10/Vespa-Scooter-PNG-Pic.png" />
      <Space />
      <InteractionFooter submitLabel="Unlock" />
    </ContainerBAS>
  )
}


export default Authorization;