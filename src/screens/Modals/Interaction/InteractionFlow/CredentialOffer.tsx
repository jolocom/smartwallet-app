import React, { useCallback } from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getIsFullscreenCredOffer,
  getOfferCredentialsBySection,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { OfferUICredential } from '~/types/credentials'
import InteractionDescription from './components/InteractionDescription'
import InteractionFooter from './components/InteractionFooter'
import InteractionLogo from './components/InteractionLogo'
import InteractionSection from './components/InteractionSection'
import InteractionTitle from './components/InteractionTitle'
import {
  ContainerBAS,
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerBAS,
  LogoContainerFAS,
  Space,
} from './components/styled'
import Collapsible from '~/components/Collapsible'

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()

  const renderBody = () => (
    <>
      <Text>Incoming Offer Card</Text>
      <Space />
    </>
  )

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle label={strings.INCOMING_OFFER} />
      <InteractionDescription
        label={strings.SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS}
      />
      <Space />
      {renderBody()}
      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={strings.RECEIVE}
      />
    </ContainerBAS>
  )
}

const CredentialOfferFAS = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)
  const handleSubmit = useCredentialOfferSubmit()

  const handleRenderCredentails = (credentials: OfferUICredential[]) =>
    credentials.map(({ type, invalid }, idx) => (
      <View
        style={{
          height: 330,
          width: '100%',
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
        }}
      >
        <Text>incoming offer card: {type}</Text>
      </View>
    ))

  return (
    <ContainerFAS>
      <Collapsible>
        <Collapsible.AnimatedHeader>
          <Collapsible.HeaderText>
            {strings.INCOMING_OFFER}
          </Collapsible.HeaderText>
        </Collapsible.AnimatedHeader>
        <Collapsible.ScrollView>
          <Collapsible.HidingScale>
            <LogoContainerFAS>
              <InteractionLogo />
            </LogoContainerFAS>
          </Collapsible.HidingScale>
          <Collapsible.HidingTextContainer>
            <InteractionTitle label={strings.INCOMING_OFFER} />
          </Collapsible.HidingTextContainer>
          <InteractionDescription
            label={strings.SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS}
          />
          <Space />
          <InteractionSection title={strings.DOCUMENTS}>
            {handleRenderCredentails(documents)}
          </InteractionSection>
          <InteractionSection title={strings.OTHER}>
            {handleRenderCredentails(other)}
          </InteractionSection>
        </Collapsible.ScrollView>
      </Collapsible>
      <FooterContainerFAS>
        <InteractionFooter
          onSubmit={handleSubmit}
          submitLabel={strings.RECEIVE}
        />
      </FooterContainerFAS>
    </ContainerFAS>
  )
}

const CredentialOffer = () => {
  const isFAS = useSelector(getIsFullscreenCredOffer)
  return isFAS ? <CredentialOfferFAS /> : <CredentialOfferBAS />
}

export default CredentialOffer
