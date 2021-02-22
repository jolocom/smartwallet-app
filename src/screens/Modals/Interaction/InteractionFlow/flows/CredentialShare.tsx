import React from 'react';
import { useSelector } from 'react-redux';
import { getIsFullscreenCredShare } from '~/modules/interaction/selectors';
import InteractionDescription from './components/InteractionDescription';
import InteractionFooter from './components/InteractionFooter';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, LogoContainerBAS, Space } from './components/styled';

/* --- CredentialShare BAS API ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.Card type="offer" />
      <Interaction.BAS.AddCredential />
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Accept" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

export const CredentialShareBAS = () => {
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      {/* TODO: body of the interaction */}
      <InteractionFooter submitLabel="Receive" />
    </ContainerBAS>
  )
}

/* --- CredentialShare FAS API - WIP ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
      <Interaction.BAS.AddCredential />
      {sections.map(s => (
        <Interaction.BAS.Section label={s.label}>
          {s.offers.map(o => (
            <Interaction.BAS.Card {...o} type="offer" />
          ))}
        </Interaction.BAS.Section>      
      ))}
    </Interaction.BAS.Body>
    <Interaction.BAS.Footer>
      <Interaction.BAS.Submit label="Accept" />
      <Interaction.BAS.Ignore />
    </Interaction.BAS.Footer>
  </Interaction.BAS>
*/

const CredentialShareFAS = () => {
  return null
}

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare);
  return isFAS ? <CredentialShareFAS /> : <CredentialShareBAS />
}

export default CredentialShare;
