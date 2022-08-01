import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeArea } from 'react-native-safe-area-context'

import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getIsFullscreenCredOffer,
  getOfferedCredentials,
  getServiceDescription,
} from '~/modules/interaction/selectors'
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
import Space from '~/components/Space'
import Collapsible from '~/components/Collapsible'
import useTranslation from '~/hooks/useTranslation'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import { ServiceLogo } from '~/components/ServiceLogo'
import { getAllDocuments } from '~/modules/credentials/selectors'
import { OfferedCredentialDisplay } from '~/types/credentials'
import { OfferCard } from '~/components/Cards'

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
        let previewFields = d.properties.filter((f) => f.preview === true)
        previewFields = previewFields.length ? previewFields : d.properties

        return (
          <OfferCard
            key={d.name}
            credentialName={d.name || t('General.unknown')}
            fields={previewFields.map((p) => ({
              label: p.label || t('Documents.unspecifiedField'),
            }))}
            issuerIcon={image}
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

  const handleRenderCredentials = (credentials: OfferedCredentialDisplay[]) =>
    documents.map(({ properties, name, type }, idx) => {
      let previewFields = properties.filter((f) => f.preview === true)
      previewFields = previewFields.length ? previewFields : properties
      return (
        <View
          key={`${type}${idx}`}
          style={{
            marginBottom: idx === credentials.length - 1 ? 0 : 30,
          }}
        >
          <OfferCard
            key={name + type}
            credentialName={name || t('General.unknown')}
            fields={previewFields.map((p) => ({
              label: p.label || t('Documents.unspecifiedField'),
            }))}
            issuerIcon={image}
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
