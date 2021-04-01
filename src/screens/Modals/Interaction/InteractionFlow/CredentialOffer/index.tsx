import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getOfferedCredentialCategories,
  getIsFullscreenCredOffer,
  getOfferedCredentialsByCategories,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { OfferedCredentialDisplay, DocumentTypes } from '~/types/credentials'
import IncomingOfferDoc from '../components/card/offer/document'
import IncomingOfferOther from '../components/card/offer/other'
import InteractionDescription from '../components/InteractionDescription'
import InteractionFooter from '../components/InteractionFooter'
import InteractionLogo from '../components/InteractionLogo'
import InteractionSection from '../components/InteractionSection'
import InteractionTitle from '../components/InteractionTitle'
import {
  ContainerBAS,
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerBAS,
  LogoContainerFAS,
  Space,
} from '../components/styled'
import { useMappedOfferDetails } from './useOfferDetails'
import { getOfferSections } from './utils'
import Collapsible from '~/components/Collapsible'

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offerDetails = useMappedOfferDetails()
  const types = useSelector(getOfferedCredentialCategories)

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
      {offerDetails === null
        ? null
        : offerDetails.map((d) => {
            if (types[d.type] === DocumentTypes.document) {
              return (
                <IncomingOfferDoc
                  key={d.name}
                  name={d.name}
                  properties={d.display.properties}
                />
              )
            }
            return (
              <IncomingOfferOther
                key={d.name}
                name={d.name}
                properties={d.display.properties}
              />
            )
          })}
      <Space />

      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={strings.RECEIVE}
      />
    </ContainerBAS>
  )
}

const CredentialOfferFAS = () => {
  const categories = useSelector(getOfferedCredentialsByCategories)

  const handleSubmit = useCredentialOfferSubmit()
  const offerDetails = useMappedOfferDetails()

  const updatedCategories = getOfferSections(categories, offerDetails)

  const documents = updatedCategories[DocumentTypes.document]
  const other = updatedCategories[DocumentTypes.other]

  const handleRenderCredentials = (credentials: OfferedCredentialDisplay[]) => {
    return credentials.map(
      ({ invalid, category, properties, name, type }, idx) => (
        <View
          style={{
            marginBottom: idx === credentials.length - 1 ? 0 : 30,
            opacity: invalid ? 0.5 : 1,
          }}
        >
          {category === CredentialRenderTypes.document ? (
            <IncomingOfferDoc
              key={name + type[1]}
              name={name || type[1]}
              properties={properties}
            />
          ) : (
            <IncomingOfferOther
              key={name + type[1]}
              name={name || type[1]}
              properties={properties}
            />
          )}
        </View>
      ),
    )
  }

  return (
    <Collapsible>
      <Collapsible.AnimatedHeader height={62}>
        <Collapsible.HeaderText>
          {strings.INCOMING_OFFER}
        </Collapsible.HeaderText>
      </Collapsible.AnimatedHeader>
      <ContainerFAS>
        <Collapsible.ScrollView
          withoutHeaderPadding
          customStyles={{ paddingHorizontal: '5%' }}
        >
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
            {handleRenderCredentials(documents)}
          </InteractionSection>
          <InteractionSection title={strings.OTHER}>
            {handleRenderCredentials(other)}
          </InteractionSection>
        </Collapsible.ScrollView>
        <FooterContainerFAS>
          <InteractionFooter
            onSubmit={handleSubmit}
            submitLabel={strings.RECEIVE}
          />
        </FooterContainerFAS>
      </ContainerFAS>
    </Collapsible>
  )
}

const CredentialOffer = () => {
  const isFAS = useSelector(getIsFullscreenCredOffer)
  return isFAS ? <CredentialOfferFAS /> : <CredentialOfferBAS />
}

export default CredentialOffer
