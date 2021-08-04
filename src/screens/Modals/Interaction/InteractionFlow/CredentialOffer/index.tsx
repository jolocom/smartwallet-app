import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import useCredentialOfferSubmit from '~/hooks/interactions/useCredentialOfferSubmit'
import {
  getIsFullscreenCredOffer,
  getOfferedCredentialsByCategories,
  getOfferedCredentials,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
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
} from '~/components/Cards/InteractionOfferCards'

const CredentialOfferBAS = () => {
  const handleSubmit = useCredentialOfferSubmit()
  const offeredCredentials = useSelector(getOfferedCredentials)
  const { t } = useTranslation()
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
      {offeredCredentials.map((d) => {
        if (d.category === CredentialCategories.document) {
          return (
            <InteractionOfferDocumentCard
              key={d.name}
              credentialName={d.name || t(strings.UNKNOWN)}
              fields={d.properties.map((p) => ({
                label: p.label || strings.NOT_SPECIFIED,
              }))}
            />
          )
        }
        return (
          <InteractionOfferOtherCard
            key={d.name}
            credentialName={d.name || t(strings.UNKNOWN)}
            fields={d.properties.map((p) => ({
              label: p.label || strings.NOT_SPECIFIED,
            }))}
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

  const documents = categories[CredentialCategories.document]
  const other = categories[CredentialCategories.other]

  const { t } = useTranslation()

  const handleRenderCredentials = (credentials: OfferedCredentialDisplay[]) => {
    return credentials.map(
      ({ invalid, category, properties, name, type }, idx) => (
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
              credentialName={name || t(strings.UNKNOWN)}
              fields={properties.map((p) => ({
                label: p.label || strings.NOT_SPECIFIED,
              }))}
            />
          ) : (
            <InteractionOfferOtherCard
              key={name + type}
              credentialName={name || t(strings.UNKNOWN)}
              fields={properties.map((p) => ({
                label: p.label || strings.NOT_SPECIFIED,
              }))}
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
