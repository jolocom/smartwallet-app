import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import CollapsedScrollView from '~/components/CollapsedScrollView';
import JoloText from '~/components/JoloText';
import ShareAttributeWidget from '~/components/Widget/ShareAttributeWidget';
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit';
import { useSwitchScreens } from '~/hooks/navigation';
import { getInteractionTitle, getIsFullscreenCredShare, getSingleCredentialToShare, getSingleMissingAttribute } from '~/modules/interaction/selectors';
import { ScreenNames } from '~/types/screens';
import InteractionDescription from './components/InteractionDescription';
import InteractionFooter from './components/InteractionFooter';
import InteractionLogo from './components/InteractionLogo';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, ContainerFAS, FooterContainerFAS, LogoContainerBAS, LogoContainerFAS, Space } from './components/styled';

export const CredentialShareBAS = () => {
  const singleCredentialToShare = useSelector(getSingleCredentialToShare)
  const singleMissingAttribute = useSelector(getSingleMissingAttribute);

  const handleShare = useCredentialShareSubmit();
  const handleSwitchScreens = useSwitchScreens(ScreenNames.InteractionAddCredential)
  
  const handleSubmit = () => singleMissingAttribute !== undefined
    ? handleSwitchScreens({ type: singleMissingAttribute })
    : handleShare()

  const renderBody = () => {
    if (singleMissingAttribute) return null
    else if (singleCredentialToShare !== undefined) return (
      <>
        <JoloText>Incoming Request Card</JoloText>
        <Space />
      </>
    )
    else return (
      <>
        <ShareAttributeWidget />
        <Space />
      </>
    )
  }

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle />
      <InteractionDescription />
      <Space />
      {renderBody()}
      <InteractionFooter onSubmit={handleSubmit} />
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
  const interactionTitle = useSelector(getInteractionTitle);
  const handleSubmit = useCredentialShareSubmit();

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

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare);
  return isFAS ? <CredentialShareFAS /> : <CredentialShareBAS />
}

export default CredentialShare;
