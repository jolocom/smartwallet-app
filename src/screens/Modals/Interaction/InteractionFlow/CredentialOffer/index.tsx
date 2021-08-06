import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

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
import Collapsible from '~/components/Collapsible'
import Space from '~/components/Space'
import useTranslation from '~/hooks/useTranslation'
import {
  InteractionOfferDocumentCard,
  InteractionOfferOtherCard,
} from '~/components/Cards/InteractionOffer'

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

  return (
    <Collapsible>
      <Collapsible.AnimatedHeader height={62}>
        <Collapsible.HeaderText>
          {t('CredentialOffer.header')}
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
            <InteractionTitle label={t('CredentialOffer.header')} />
          </Collapsible.HidingTextContainer>
          <InteractionDescription
            label={t('CredentialOffer.subheader', { serviceName: name })}
          />
          <Space />
          <InteractionSection title={t('Documents.documentsTab')}>
            {handleRenderCredentials(documents)}
          </InteractionSection>
          <InteractionSection title={t('Documents.othersTab')}>
            {handleRenderCredentials(other)}
          </InteractionSection>
        </Collapsible.ScrollView>
        <FooterContainerFAS>
          <InteractionFooter
            onSubmit={handleSubmit}
            submitLabel={t('CredentialOffer.confirmBtn')}
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
