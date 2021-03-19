import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getCredByType,
  getIsFullscreenCredOffer,
  getOfferedCredentialsByCategories,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { OfferedCredential, OtherCategory } from '~/types/credentials'
import IncomingOfferDoc from '../components/card/offer/document'
import IncomingOfferOther from '../components/card/offer/other'
import {
  IIncomingOfferDocProps,
  IIncomingOfferOtherProps,
} from '../components/card/types'
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
import { separateIntoSections } from './utils'

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offerDetails = useMappedOfferDetails()
  const types = useSelector(getCredByType)

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
            // TODO: fix this: This wouldn't work because type are mapped to a credential type not credential name
            if (types[d.name] === CredentialRenderTypes.document) {
              return (
                <IncomingOfferDoc
                  key={d.name}
                  name={d.name}
                  properties={d.properties}
                />
              )
            }
            return (
              <IncomingOfferOther
                key={d.name}
                name={d.name}
                properties={d.properties}
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

  const {
    document: offerDocDetails,
    other: offerOtherDetails,
  } = separateIntoSections<IIncomingOfferDocProps | IIncomingOfferOtherProps>(
    {
      document: categories[CredentialRenderTypes.document],
      other: categories[OtherCategory.other],
    },
    offerDetails,
  )

  const handleRenderCollapsingComponent = useCallback(
    () => (
      <LogoContainerFAS>
        <InteractionLogo />
      </LogoContainerFAS>
    ),
    [],
  )

  const handleRenderCredentials = (
    credentials: OfferedCredential[],
    details: IIncomingOfferDocProps[] | IIncomingOfferDocProps[],
    renderType: CredentialRenderTypes.document | 'other',
  ) => {
    return credentials.map(({ invalid }, idx) => (
      <View
        style={{
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
        }}
      >
        {renderType === CredentialRenderTypes.document
          ? details.map((d) => (
              <IncomingOfferDoc
                key={d.name}
                name={d.name}
                properties={d.properties}
              />
            ))
          : details.map((d) => (
              <IncomingOfferOther
                key={d.name}
                name={d.name}
                properties={d.properties}
              />
            ))}
      </View>
    ))
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
          {handleRenderCredentials(
            categories[CredentialRenderTypes.document],
            offerDocDetails,
            CredentialRenderTypes.document,
          )}
        </InteractionSection>
        <InteractionSection title={strings.OTHER}>
          {handleRenderCredentials(
            categories[OtherCategory.other],
            offerOtherDetails,
            'other',
          )}
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
