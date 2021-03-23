import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getOfferedCredentialCategories,
  getIsFullscreenCredOffer,
  getOfferedCredentialsByCategories,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { OfferedCredentialDisplay, OtherCategory } from '~/types/credentials'
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
            if (types[d.type] === CredentialRenderTypes.document) {
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

  const documents = updatedCategories[CredentialRenderTypes.document]
  const other = updatedCategories[OtherCategory.other]

  const handleRenderCollapsingComponent = useCallback(
    () => (
      <LogoContainerFAS>
        <InteractionLogo />
      </LogoContainerFAS>
    ),
    [],
  )

  const handleRenderCredentials = (credentials: OfferedCredentialDisplay[]) => {
    return credentials.map(
      ({ invalid, category, properties, name, type }, idx) => (
        <View
          style={{
            marginBottom: idx === credentials.length - 1 ? 0 : 30,
          }}
        >
          {category === CredentialRenderTypes.document ? (
            <IncomingOfferDoc
              key={name + type[1]}
              name={name}
              properties={properties}
            />
          ) : (
            <IncomingOfferOther
              key={name + type[1]}
              name={name}
              properties={properties}
            />
          )}
        </View>
      ),
    )
  }

  return (
    <ContainerFAS>
      <CollapsedScrollView
        collapsedTitle={strings.INCOMING_OFFER}
        renderCollapsingComponent={handleRenderCollapsingComponent}
      >
        <InteractionTitle label={strings.INCOMING_OFFER} />
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
      </CollapsedScrollView>
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
