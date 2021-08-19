import React, { useEffect } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { useSelector } from 'react-redux'

import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import { useRedirect } from '~/hooks/navigation'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'
import {
  getRequestedCredentialDetailsBAS,
  getIsFullscreenCredShare,
  getIsReadyToSubmitRequest,
  getCustomRequestedCredentialsByCategoryByType,
  getSelectedShareCredentials,
  getServiceDescription,
} from '~/modules/interaction/selectors'
import {
  isDocument,
  CredentialsByType,
  DisplayCredential,
  CredentialCategories,
  AttributeTypes,
} from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import { IncomingRequestDoc } from '../components/card/request/document'
import { IncomingRequestOther } from '../components/card/request/other'
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
import CollapsibleClone from '~/components/CollapsibleClone'
import ShareAttributeWidget from './ShareAttributeWidget'
import BP from '~/utils/breakpoints'
import { PurpleTickSuccess } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import AdoptedCarousel from '~/components/AdoptedCarousel'
import { getObjectFirstValue } from '~/utils/objectUtils'
import Space from '~/components/Space'
import { SCREEN_WIDTH } from '~/utils/dimensions'
import useTranslation from '~/hooks/useTranslation'
import { attributeConfig } from '~/config/claims'
import { useCredentialOptionalFields } from '~/hooks/credentials'
import ScreenContainer from '~/components/ScreenContainer'

export const CredentialShareBAS = () => {
  const { singleRequestedAttribute, singleRequestedCredential } = useSelector(
    getRequestedCredentialDetailsBAS,
  )

  const { t } = useTranslation()
  const { name: serviceName } = useSelector(getServiceDescription)

  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)
  const singleMissingAttribute =
    singleRequestedAttribute &&
    !getObjectFirstValue(singleRequestedAttribute).length
      ? (Object.keys(singleRequestedAttribute)[0] as AttributeTypes)
      : undefined

  const handleShare = useCredentialShareSubmit()
  const redirect = useRedirect()
  const { handleSelectCredential } = useCredentialShareFlow()
  const { getOptionalFields } = useCredentialOptionalFields()

  /* We are preselecting a credential that is requested */
  useEffect(() => {
    if (singleRequestedCredential) {
      handleSelectCredential({
        [singleRequestedCredential.type]: singleRequestedCredential?.id,
      })
    }
  }, [JSON.stringify(singleRequestedCredential)])

  const handleSubmit = () =>
    singleMissingAttribute
      ? redirect(ScreenNames.CredentialForm, {
          type: singleMissingAttribute,
        })
      : handleShare()

  const renderBody = () => {
    if (singleMissingAttribute) return null
    else if (singleRequestedCredential !== undefined) {
      const displaySingleCredential = mapDisplayToCustomDisplay(
        singleRequestedCredential,
      )

      const { name } = displaySingleCredential
      const claimFields = getOptionalFields(displaySingleCredential)

      return (
        <>
          {isDocument(displaySingleCredential) ? (
            <IncomingRequestDoc
              name={name}
              holderName={
                displaySingleCredential.holderName || t('General.unknown')
              }
              properties={claimFields}
              highlight={`${displaySingleCredential.highlight?.slice(
                0,
                18,
              )}...`}
              photo={displaySingleCredential.photo}
            />
          ) : (
            <IncomingRequestOther name={name} properties={claimFields} />
          )}
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
        <InteractionLogo />
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
  const categories = useSelector(getCustomRequestedCredentialsByCategoryByType)
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)
  const { getOptionalFields } = useCredentialOptionalFields()

  const { handleSelectCredential } = useCredentialShareFlow()
  const selectedCredentials = useSelector(getSelectedShareCredentials)

  const handleSubmit = useCredentialShareSubmit()

  const documents = categories[CredentialCategories.document]
  const other = categories[CredentialCategories.other]

  const handleRenderCredentials = (
    credCollections: CredentialsByType<DisplayCredential>[],
  ) =>
    credCollections.map(({ key, value, credentials }) => {
      return (
        <AdoptedCarousel
          key={key}
          activeSlideAlignment="center"
          data={credentials}
          itemWidth={SCREEN_WIDTH - 48}
          customStyles={{ marginLeft: 0 }}
          renderItem={({ item: cred }) => {
            const claimFields = getOptionalFields(cred)
            const { name, type, id } = cred
            return (
              <TouchableWithoutFeedback
                key={id}
                onPress={() => handleSelectCredential({ [type]: id })}
              >
                <View
                  style={{
                    marginBottom: BP({ default: 24, xsmall: 16 }),
                  }}
                >
                  {isDocument(cred) ? (
                    <IncomingRequestDoc
                      name={name ?? type}
                      properties={claimFields}
                      holderName={cred.holderName || t('General.unknown')}
                      highlight={`${
                        cred.photo && cred.highlight
                          ? cred.highlight?.length > 18
                            ? cred.highlight?.slice(0, 18) + '...'
                            : cred.highlight
                          : cred.highlight
                      }`}
                      photo={cred.photo}
                    />
                  ) : (
                    <IncomingRequestOther
                      name={name ?? type}
                      properties={claimFields}
                    />
                  )}
                  <View style={styles.selectIndicator}>
                    {selectedCredentials[type] === id ? (
                      <PurpleTickSuccess />
                    ) : (
                      <View style={styles.notSelected} />
                    )}
                  </View>
                </View>
              </TouchableWithoutFeedback>
            )
          }}
        />
      )
    })

  return (
    <CollapsibleClone
      renderHeader={() => <CollapsibleClone.Header />}
      renderScroll={() => (
        <ContainerFAS>
          <CollapsibleClone.Scroll containerStyles={{ paddingBottom: '30%' }}>
            <CollapsibleClone.Scale>
              <LogoContainerFAS>
                <InteractionLogo />
              </LogoContainerFAS>
            </CollapsibleClone.Scale>
            <CollapsibleClone.Title text={t('CredentialRequest.header')}>
              <InteractionTitle label={t('CredentialRequest.header')} />
            </CollapsibleClone.Title>
            <InteractionDescription label={t('CredentialRequest.subheader')} />
            <Space />
            <ScreenContainer.Padding>
              <ShareAttributeWidget withContainer />
            </ScreenContainer.Padding>
            <InteractionSection
              title={t('Documents.documentsTab')}
              isPaddedTitle={true}
            >
              {handleRenderCredentials(documents)}
            </InteractionSection>
            <InteractionSection
              title={t('Documents.othersTab')}
              isPaddedTitle={true}
            >
              {handleRenderCredentials(other)}
            </InteractionSection>
          </CollapsibleClone.Scroll>
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
    </CollapsibleClone>
  )
}

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare)
  return isFAS ? <CredentialShareFAS /> : <CredentialShareBAS />
}

const styles = StyleSheet.create({
  notSelected: {
    width: 20,
    height: 20,
    borderColor: Colors.black,
    opacity: 0.3,
    borderWidth: 1,
    borderRadius: 10,
  },
  selectIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
})

export default CredentialShare
