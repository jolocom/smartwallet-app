import React, { useEffect } from 'react'
import { TouchableWithoutFeedback, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { useSelector } from 'react-redux'

import AdoptedCarousel from '~/components/AdoptedCarousel'
import { ShareCard } from '~/components/Cards'
import Collapsible from '~/components/Collapsible'
import ScreenContainer from '~/components/ScreenContainer'
import { ServiceLogo } from '~/components/ServiceLogo'
import Space from '~/components/Space'
import { attributeConfig } from '~/config/claims'
import { useDocuments } from '~/hooks/documents'
import { Document } from '~/hooks/documents/types'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import { useRedirect } from '~/hooks/navigation'
import useTranslation from '~/hooks/useTranslation'
import {
  getIsFullscreenCredShare,
  getIsReadyToSubmitRequest,
  getRequestedCredentialDetailsBAS,
  getRequestedDocumentsByType,
  getSelectedShareCredentials,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import { AttributeTypes, CredentialsByType } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { SCREEN_WIDTH } from '~/utils/dimensions'
import { getObjectFirstValue } from '~/utils/objectUtils'
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
import ShareAttributeWidget from './ShareAttributeWidget'

export const CredentialShareBAS = () => {
  const { singleRequestedAttribute, singleRequestedCredential: document } =
    useSelector(getRequestedCredentialDetailsBAS)

  const { t } = useTranslation()
  const {
    name: serviceName,
    image,
    serviceUrl,
  } = useSelector(getServiceDescription)

  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)
  const singleMissingAttribute =
    singleRequestedAttribute &&
    !getObjectFirstValue(singleRequestedAttribute).length
      ? (Object.keys(singleRequestedAttribute)[0] as AttributeTypes)
      : undefined

  const handleShare = useCredentialShareSubmit()
  const redirect = useRedirect()
  const { handleSelectCredential } = useCredentialShareFlow()
  const {
    getExtraProperties,
    getPreviewProperties,
    getHolderName,
    getHolderPhoto,
  } = useDocuments()

  /* We are preselecting a credential that is requested */
  useEffect(() => {
    if (document) {
      handleSelectCredential({
        [document.type[document.type.length - 1]]: document.id,
      })
    }
  }, [JSON.stringify(document)])

  const handleSubmit = async () =>
    singleMissingAttribute
      ? redirect(ScreenNames.CredentialForm, {
          type: singleMissingAttribute,
        })
      : handleShare()

  const renderBody = () => {
    if (singleMissingAttribute) return null
    else if (document) {
      const { name, issuer } = document

      let previewFields = getPreviewProperties(document)
      previewFields = previewFields.length
        ? previewFields
        : getExtraProperties(document)

      return (
        <>
          <ShareCard
            credentialName={name}
            holderName={getHolderName(document)}
            fields={previewFields}
            photo={getHolderPhoto(document)}
            issuerIcon={issuer.icon}
          />
          <Space />
        </>
      )
    } else {
      return (
        <>
          <ShareAttributeWidget />
          <Space />
        </>
      )
    }
  }

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <ServiceLogo source={image} serviceUrl={serviceUrl} />
      </LogoContainerBAS>
      <InteractionTitle
        label={
          singleMissingAttribute
            ? t('CredentialShare.headerSingleMissing', {
                serviceName,
                // @ts-expect-error @terms
                attribute: t(attributeConfig[singleMissingAttribute].label),
              })
            : t('CredentialRequest.header')
        }
      />
      <InteractionDescription
        label={
          singleMissingAttribute
            ? t('CredentialShare.singleMissingSubheader')
            : t('CredentialRequest.subheader', { serviceName })
        }
      />
      <Space />
      {renderBody()}
      <InteractionFooter
        disabled={!isReadyToSubmit}
        onSubmit={handleSubmit}
        disableLoader={Boolean(singleMissingAttribute)}
        submitLabel={
          singleMissingAttribute
            ? t('CredentialShare.singleMissingAcceptBtn')
            : t('CredentialRequest.acceptBtn')
        }
      />
    </ContainerBAS>
  )
}

const CredentialShareFAS = () => {
  const { t } = useTranslation()
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

  const {
    name: serviceName,
    image,
    serviceUrl,
  } = useSelector(getServiceDescription)

  const {
    getExtraProperties,
    getPreviewProperties,
    getHolderName,
    getHolderPhoto,
  } = useDocuments()

  const { handleSelectCredential } = useCredentialShareFlow()
  const selectedCredentials = useSelector(getSelectedShareCredentials)

  const handleSubmit = useCredentialShareSubmit()

  const documentsByType = useSelector(getRequestedDocumentsByType)

  const handleRenderCredentials = (
    credCollections: Array<CredentialsByType<Document>>,
  ) =>
    credCollections.map(({ value, credentials }) => (
      <AdoptedCarousel<Document>
        key={value}
        activeSlideAlignment="center"
        data={credentials}
        itemWidth={SCREEN_WIDTH - 48}
        customStyles={{ marginLeft: 0 }}
        renderItem={({ item: cred }) => {
          let previewFields = getPreviewProperties(cred)
          previewFields = previewFields.length
            ? previewFields
            : getExtraProperties(cred)

          const { name, type, id, issuer } = cred
          const specificType = type[type.length - 1]
          return (
            <TouchableWithoutFeedback
              key={id}
              onPress={() => handleSelectCredential({ [specificType]: id })}
            >
              <View
                style={{
                  marginBottom: BP({ default: 24, xsmall: 16 }),
                }}
              >
                <ShareCard
                  credentialName={name}
                  fields={previewFields}
                  holderName={getHolderName(cred)}
                  photo={getHolderPhoto(cred)}
                  selected={selectedCredentials[specificType] === id}
                  issuerIcon={issuer.icon}
                />
              </View>
            </TouchableWithoutFeedback>
          )
        }}
      />
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
                  <ServiceLogo source={image} serviceUrl={serviceUrl} />
                </LogoContainerFAS>
              </Collapsible.Scale>
              <Collapsible.Title text={t('CredentialRequest.header')}>
                <InteractionTitle label={t('CredentialRequest.header')} />
              </Collapsible.Title>
              <InteractionDescription
                label={t('CredentialRequest.subheader', {
                  serviceName,
                })}
              />
              <Space />
              <ScreenContainer.Padding>
                <ShareAttributeWidget withContainer />
              </ScreenContainer.Padding>
              {handleRenderCredentials(documentsByType)}
            </Collapsible.Scroll>
          </ContainerFAS>
        )}
      >
        <FooterContainerFAS>
          <InteractionFooter
            disabled={!isReadyToSubmit}
            onSubmit={handleSubmit}
            submitLabel={t('CredentialRequest.acceptBtn')}
          />
        </FooterContainerFAS>
      </Collapsible>
    </View>
  )
}

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare)
  return isFAS ? <CredentialShareFAS /> : <CredentialShareBAS />
}

export default CredentialShare
