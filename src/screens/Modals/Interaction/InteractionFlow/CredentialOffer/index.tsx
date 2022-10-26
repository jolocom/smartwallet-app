import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import { OfferCard } from '~/components/Cards'
import Collapsible from '~/components/Collapsible'
import ScreenContainer from '~/components/ScreenContainer'
import { ServiceLogo } from '~/components/ServiceLogo'
import Space from '~/components/Space'
import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import useTranslation from '~/hooks/useTranslation'
import {
  getIsFullscreenCredOffer,
  getOfferedCredentials,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import {
  CredentialDefinition,
  CredentialDefinitionImage,
} from '@jolocom/protocol-ts'
import { DisplayCredential, OfferedCredential } from '~/types/credentials'
import { Colors } from '~/utils/colors'
import InteractionDescription from '../components/InteractionDescription'
import InteractionFooter from '../components/InteractionFooter'
import InteractionTitle from '../components/InteractionTitle'
import {
  ContainerBAS,
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerBAS,
  LogoContainerFAS,
} from '../components/styled'

const assemblePreviewProperties = (offer: OfferedCredential) => {
  let previewFields = offer.properties.filter((f) => f.preview === true)
  previewFields = previewFields.length ? previewFields : offer.properties

  return previewFields
}

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offeredCredentials = useSelector(getOfferedCredentials)
  const { name, image, serviceUrl } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <ServiceLogo source={image} serviceUrl={serviceUrl} />
      </LogoContainerBAS>
      <InteractionTitle label={t('CredentialOffer.header')} />
      <InteractionDescription
        label={t('CredentialOffer.subheader', { serviceName: name })}
      />
      <Space />
      {offeredCredentials.map((d) => {
        const previewFields = assemblePreviewProperties(d)
        return (
          <OfferCard
            key={d.name}
            credentialName={d.name || t('General.unknown')}
            fields={previewFields}
            issuerIcon={image}
            styles={d.style as Pick<DisplayCredential['styles'], 'background'>}
          />
        )
      })}
      <Space />

      <InteractionFooter
        onSubmit={handleSubmit}
        submitLabel={t('CredentialOffer.confirmBtn')}
      />
    </ContainerBAS>
  )
}

const CredentialOfferFAS = () => {
  const handleSubmit = useCredentialOfferSubmit()

  const documents = useSelector(getOfferedCredentials)

  const { name, image, serviceUrl } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  const handleRenderCredentials = (credentials: OfferedCredential[]) =>
    documents.map((doc, idx) => {
      const previewFields = assemblePreviewProperties(doc)

      return (
        <View
          key={`${doc.type}${idx}`}
          style={{
            marginBottom: idx === credentials.length - 1 ? 0 : 30,
          }}
        >
          <OfferCard
            key={doc.name + doc.type}
            credentialName={name || t('General.unknown')}
            fields={previewFields}
            issuerIcon={image}
            styles={
              doc.style as Pick<DisplayCredential['styles'], 'background'>
            }
          />
        </View>
      )
    })

  const { top } = useSafeArea()
  return (
    <View style={{ paddingTop: top, backgroundColor: Colors.mainBlack }}>
      <Collapsible
        renderHeader={() => <Collapsible.Header />}
        renderScroll={() => (
          <ContainerFAS>
            <Collapsible.Scroll containerStyles={{ paddingBottom: '30%' }}>
              <Collapsible.Scale>
                <LogoContainerFAS>
                  <ServiceLogo source={image} serviceUrl={serviceUrl} />
                </LogoContainerFAS>
              </Collapsible.Scale>
              <Collapsible.Title text={t('CredentialOffer.header')}>
                <InteractionTitle label={t('CredentialOffer.header')} />
              </Collapsible.Title>
              <InteractionDescription
                label={t('CredentialOffer.subheader', { serviceName: name })}
              />
              <Space />
              <ScreenContainer.Padding>
                {handleRenderCredentials(documents)}
              </ScreenContainer.Padding>
            </Collapsible.Scroll>
          </ContainerFAS>
        )}
      >
        <FooterContainerFAS>
          <InteractionFooter
            onSubmit={handleSubmit}
            submitLabel={t('CredentialOffer.confirmBtn')}
          />
        </FooterContainerFAS>
      </Collapsible>
    </View>
  )
}

const CredentialOffer = () => {
  const isFAS = useSelector(getIsFullscreenCredOffer)
  return isFAS ? <CredentialOfferFAS /> : <CredentialOfferBAS />
}

export default CredentialOffer
