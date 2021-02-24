import React, { useCallback } from 'react';
import { Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import CollapsedScrollView from '~/components/CollapsedScrollView';
import ShareAttributeWidget from '~/components/Widget/ShareAttributeWidget';
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit';
import { useSwitchScreens } from '~/hooks/navigation';
import { getInteractionTitle, getIsFullscreenCredShare, getShareCredentialsBySection, getSingleCredentialToShare, getSingleMissingAttribute } from '~/modules/interaction/selectors';
import { strings } from '~/translations';
import { MultipleShareUICredential } from '~/types/credentials';
import { ScreenNames } from '~/types/screens';
import InteractionDescription from './components/InteractionDescription';
import InteractionFooter from './components/InteractionFooter';
import InteractionLogo from './components/InteractionLogo';
import InteractionSection from './components/InteractionSection';
import InteractionTitle from './components/InteractionTitle';
import { AttributeWidgetContainerFAS, ContainerBAS, ContainerFAS, FooterContainerFAS, LogoContainerBAS, LogoContainerFAS, Space } from './components/styled';

// Generic selector for every interaction => InteractionDescription
/*
    counterpartyDetails: {
      isAnonymous: boolean,
      counterparty: {}
    },
*/

// Generic selector for every interaction => InteractionIcon
/*
    counterparty: {},
*/

/*
  BAS
  {
    singleMissingAttribute: AttributeType,
    singleCredential: credential,
  }
  FAS
  {
    sections: {
      other: credential[],
      documents: credential[]
    },
  }
*/

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
        <Text>Incoming Request Card</Text>
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

const CredentialShareFAS = () => {
  const interactionTitle = useSelector(getInteractionTitle);
  const { documents, other } = useSelector(getShareCredentialsBySection)

  const handleSubmit = useCredentialShareSubmit();

  const handleRenderCollapsingComponent = useCallback(() => (
    <LogoContainerFAS>
      <InteractionLogo />
    </LogoContainerFAS>
  ), [])

  const handleRenderCredentials = (credCollections: MultipleShareUICredential[]) => 
    credCollections.map(({ type, credentials }) => {
      const isCarousel = credentials.length > 1
      // TODO: implement carousel
      const Wrapper = isCarousel ? React.Fragment : React.Fragment

      return (
        <Wrapper>
          {credentials.map((cred) => (
            <View
              style={{
                marginRight: 20,
                marginVertical: 14,
              }}
            >
              <Text>
                {type}
              </Text>
            </View>
          ))}
        </Wrapper>
      )
    })

  return (
    <ContainerFAS>
      <CollapsedScrollView
        collapsedTitle={interactionTitle ?? strings.UNKNOWN_TITLE}
        renderCollapsingComponent={handleRenderCollapsingComponent}
      >
        <InteractionTitle />
        <InteractionDescription />
        <Space />
        <AttributeWidgetContainerFAS>
          <ShareAttributeWidget />
        </AttributeWidgetContainerFAS>
        <InteractionSection title={strings.DOCUMENTS}>
          {handleRenderCredentials(documents)}
        </InteractionSection>
        <InteractionSection title={strings.OTHER}>
          {handleRenderCredentials(other)}
        </InteractionSection>

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
