import React, { useCallback } from 'react';
import { View } from 'react-native';
import { useSelector } from 'react-redux';
import CollapsedScrollView from '~/components/CollapsedScrollView';
import JoloText, { JoloTextKind } from '~/components/JoloText';
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit';
import { getInteractionTitle, getIsFullscreenCredOffer, getOfferCredentialsBySection } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import { OfferUICredential } from '~/types/credentials';
import { Colors } from '~/utils/colors';
import { JoloTextSizes } from '~/utils/fonts';
import InteractionDescription from './components/InteractionDescription';
import InteractionFooter from './components/InteractionFooter';
import InteractionLogo from './components/InteractionLogo';
import InteractionSection from './components/InteractionSection';
import InteractionTitle from './components/InteractionTitle';
import { ContainerBAS, ContainerFAS, FooterContainerFAS, LogoContainerBAS, LogoContainerFAS, Space } from './components/styled';

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()

  const renderBody = () => (
    <>
      <JoloText>Incoming Offer Card</JoloText>
      <Space />
    </>
  )

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

const CredentialOfferFAS = () => {
  const interactionTitle = useSelector(getInteractionTitle);
  const { documents, other } = useSelector(getOfferCredentialsBySection)
  const handleSubmit = useCredentialOfferSubmit()

  const handleRenderCollapsingComponent = useCallback(() => (
    <LogoContainerFAS>
      <InteractionLogo />
    </LogoContainerFAS>
  ), [])

  const handleRenderCredentails = (credentials: OfferUICredential[]) => 
    credentials.map(({ type, invalid }, idx) => (
      <View
        style={{
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
        }}
      >
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.middle}
          color={Colors.black}
        >
          incoming offer card: {type}
        </JoloText>
      </View>
    ))

  return (
    <ContainerFAS>
      <CollapsedScrollView
        collapsedTitle={interactionTitle}
        renderCollapsingComponent={handleRenderCollapsingComponent}
      >
        <InteractionTitle />
        <InteractionDescription />
        <Space />
        <InteractionSection title={strings.DOCUMENTS}>
          {handleRenderCredentails(documents)}
        </InteractionSection>
        <InteractionSection title={strings.OTHER}>
          {handleRenderCredentails(other)}
        </InteractionSection>
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
