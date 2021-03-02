import React, { useCallback, useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import CollapsedScrollView from '~/components/CollapsedScrollView'
import { useInteraction } from '~/hooks/interactions'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getIsFullscreenCredOffer,
  getOfferCredentialsBySection,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { OfferUICredential } from '~/types/credentials'
import IncomingOfferDoc from './components/card/offer/document'
import {
  IIncomingOfferDocProps,
  IIncomingOfferOtherProps,
  isIncomingOfferCard,
} from './components/card/types'
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

// NOTE: this complexity is not necessary
function* makeDetailsIterator(details: any) {
  yield details.every((d: any) => isIncomingOfferCard(d))
}

interface IOfferCardProps {
  details: IIncomingOfferDocProps[] | IIncomingOfferOtherProps[] | null
}
const OfferCard: React.FC<IOfferCardProps> = ({ details }) => {
  if (details === null) return null
  return (
    <>
      {details.map((d) => (
        <IncomingOfferDoc name={d.name} properties={d.properties} />
      ))}
      <Space />
    </>
  )
}

const useGetOfferDetails = () => {
  const getInteraction = useInteraction()

  return async () => {
    const interaction = await getInteraction()
    const offerDetails = await interaction.flow.getOfferDisplay()

    const detailsIterator = makeDetailsIterator(offerDetails)
    if (detailsIterator.next().value) {
      return offerDetails
    }
    return null
  }
}

const useOfferDetails = () => {
  const [offerDetails, setOfferDetails] = useState<
    IIncomingOfferDocProps[] | IIncomingOfferOtherProps[] | null
  >(null)
  const getOfferDetails = useGetOfferDetails()

  const handleGettingOfferDetails = async () => {
    const details = await getOfferDetails()
    setOfferDetails(details)
  }
  useEffect(() => {
    handleGettingOfferDetails()
  }, [])

  return offerDetails
}

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offerDetails = useOfferDetails()

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
      <OfferCard details={offerDetails} />
      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={strings.RECEIVE}
      />
    </ContainerBAS>
  )
}

const separateIntoSections = (sections, details) => {
  if (!details) return { documents: [], other: [] }
  return details.reduce(
    (acc, v) => {
      // TODO: generalize fn
      if (sections.documents.find((d) => d.type === v.name)) {
        acc.documents = [...acc.documents, v]
        // TODO: generalize fn
      } else if (sections.documents.find((o) => o.type === v.name)) {
        acc.other = [...acc.other, v]
      }
      return acc
    },
    { documents: [], other: [] },
  ) // TODO: add keys dynamically
}

const CredentialOfferFAS = () => {
  const { documents, other } = useSelector(getOfferCredentialsBySection)
  const handleSubmit = useCredentialOfferSubmit()
  const offerDetails = useOfferDetails()

  const {
    documents: offerDocDetails,
    other: offerOtherDetails,
  } = separateIntoSections({ documents, other }, offerDetails)

  const handleRenderCollapsingComponent = useCallback(
    () => (
      <LogoContainerFAS>
        <InteractionLogo />
      </LogoContainerFAS>
    ),
    [],
  )

  const handleRenderCredentails = (
    credentials: OfferUICredential[],
    details: IIncomingOfferDocProps[] | IIncomingOfferDocProps[],
  ) => {
    return credentials.map(({ type, invalid }, idx) => (
      <View
        style={{
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
        }}
      >
        <OfferCard details={details} />
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
          {handleRenderCredentails(documents, offerDocDetails)}
        </InteractionSection>
        <InteractionSection title={strings.OTHER}>
          {handleRenderCredentails(other, offerOtherDetails)}
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
