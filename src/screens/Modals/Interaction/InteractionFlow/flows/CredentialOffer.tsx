import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import CollapsedScrollView from '~/components/CollapsedScrollView';
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit';
import { getInteractionTitle, getIsFullscreenCredOffer } from '~/modules/interaction/selectors';
import InteractionDescription from './components/InteractionDescription';
import InteractionFooter from './components/InteractionFooter';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, ContainerFAS, FooterContainerFAS, LogoContainerBAS, LogoContainerFAS, Space } from './components/styled';

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      {/* TODO: body of the interaction */}
      <InteractionFooter onSubmit={handleSubmit} />
    </ContainerBAS>
  )
}

/* --- CredentialOffer FAS API - WIP ---
  <Interaction.BAS>
    <Interaction.BAS.Logo />
    <Interaction.BAS.Title />
    <Interaction.BAS.Description />
    <Interaction.BAS.Body>
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

const CredentialOfferFAS = () => {
  const interactionTitle = useSelector(getInteractionTitle);
  const handleSubmit = useCredentialOfferSubmit()

  const handleRenderCollapsingComponent = useCallback(() => (
    <LogoContainerFAS>
      <InteractionLogo />
    </LogoContainerFAS>
  ), [])

  return (
    <ContainerFAS>
      <CollapsedScrollView
        collapsedTitle={interactionTitle}
        renderCollapsingComponent={handleRenderCollapsingComponent}
      >
        <InteractionTitle />
        <InteractionDescription />
        <Space />
      </CollapsedScrollView>
      <FooterContainerFAS>
        <InteractionFooter onSubmit={handleSubmit} />
      </FooterContainerFAS>
    </ContainerFAS>
  )
}

const CredentialOffer = () => {
  const isFAS = useSelector(getIsFullscreenCredOffer)
  return isFAS ? <CredentialOfferFAS /> : <CredentialOfferBAS />
}

export default CredentialOffer
