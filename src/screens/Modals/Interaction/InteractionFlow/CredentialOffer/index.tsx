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
} from '../components/styled'
import Collapsible from '~/components/Collapsible'
import Space from '~/components/Space'
import useTranslation from '~/hooks/useTranslation'

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
            <IncomingOfferDoc
              key={d.name}
              name={d.name || t('General.unknown')}
              properties={d.properties}
            />
          )
        }
        return (
          <IncomingOfferOther
            key={d.name}
            name={d.name || t('General.unknown')}
            properties={d.properties}
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
          <IncomingOfferDoc
            key={name + type}
            name={name || t('General.unknown')}
            properties={properties}
          />
        ) : (
          <IncomingOfferOther
            key={name + type}
            name={name || t('General.unknown')}
            properties={properties}
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
