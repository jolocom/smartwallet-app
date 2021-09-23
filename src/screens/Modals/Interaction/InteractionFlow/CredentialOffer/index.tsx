import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import { useSafeArea } from 'react-native-safe-area-context'

import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getIsFullscreenCredOffer,
  getOfferedCredentialsByCategories,
  getOfferedCredentials,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import {
  OfferedCredentialDisplay,
  CredentialCategories,
} from '~/types/credentials'
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
} from '../components/styled'
import Space from '~/components/Space'
import Collapsible from '~/components/Collapsible'
import useTranslation from '~/hooks/useTranslation'
import ScreenContainer from '~/components/ScreenContainer'
import {
  InteractionOfferDocumentCard,
  InteractionOfferOtherCard,
} from '~/components/Cards/InteractionOffer'
import { Colors } from '~/utils/colors'

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offeredCredentials = useSelector(getOfferedCredentials)
  const { name } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle label={t('CredentialOffer.header')} />
      <InteractionDescription
        label={t('CredentialOffer.subheader', { serviceName: name })}
      />
      <Space />
      {offeredCredentials.map((d) => {
        if (d.category === CredentialCategories.document) {
          return (
            <InteractionOfferDocumentCard
              key={d.name}
              credentialName={d.name || t('General.unknown')}
              fields={d.properties.map((p) => ({
                label: p.label || t('Documents.unspecifiedField'),
              }))}
            />
          )
        }
        return (
          <InteractionOfferOtherCard
            key={d.name}
            credentialName={d.name || t('General.unknown')}
            fields={d.properties.map((p) => ({
              label: p.label || t('Documents.unspecifiedField'),
            }))}
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
  const categories = useSelector(getOfferedCredentialsByCategories)
  const handleSubmit = useCredentialOfferSubmit()

  const documents = categories[CredentialCategories.document]
  const other = categories[CredentialCategories.other]

  const { name } = useSelector(getServiceDescription)
  const { t } = useTranslation()

  const handleRenderCredentials = (credentials: OfferedCredentialDisplay[]) =>
    credentials.map(({ invalid, category, properties, name, type }, idx) => (
      <View
        key={type + idx}
        style={{
          marginBottom: idx === credentials.length - 1 ? 0 : 30,
          opacity: invalid ? 0.5 : 1,
        }}
      >
        {category === CredentialCategories.document ? (
          <InteractionOfferDocumentCard
            key={name + type}
            credentialName={name || t('General.unknown')}
            fields={properties.map((p) => ({
              label: p.label || t('Documents.unspecifiedField'),
            }))}
          />
        ) : (
          <InteractionOfferOtherCard
            key={name + type}
            credentialName={name || t('General.unknown')}
            fields={properties.map((p) => ({
              label: p.label || t('Documents.unspecifiedField'),
            }))}
          />
        )}
      </View>
    ))

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
                  <InteractionLogo />
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
                <InteractionSection title={t('Documents.documentsTab')}>
                  {handleRenderCredentials(documents)}
                </InteractionSection>
                <InteractionSection title={t('Documents.othersTab')}>
                  {handleRenderCredentials(other)}
                </InteractionSection>
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
