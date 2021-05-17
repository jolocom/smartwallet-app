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
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import {
  isDocument,
  CredentialsByType,
  DisplayCredential,
  CredentialCategories,
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
  Space,
} from '../components/styled'
import ShareAttributeWidget from './ShareAttributeWidget'
import { getOptionalFields } from '~/screens/LoggedIn/Documents/utils'
import Collapsible from '~/components/Collapsible'
import BP from '~/utils/breakpoints'
import { PurpleTickSuccess } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import AdoptedCarousel from '~/components/AdoptedCarousel'
import { getObjectFirstValue } from '~/utils/objectUtils'
import ScreenContainer from '~/components/ScreenContainer'

export const CredentialShareBAS = () => {
  const { singleRequestedAttribute, singleRequestedCredential } = useSelector(
    getRequestedCredentialDetailsBAS,
  )

  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)
  const singleMissingAttribute =
    singleRequestedAttribute &&
    !getObjectFirstValue(singleRequestedAttribute).length
      ? Object.keys(singleRequestedAttribute)[0]
      : undefined

  const handleShare = useCredentialShareSubmit()
  const redirect = useRedirect()
  const { handleSelectCredential } = useCredentialShareFlow()

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

      const { type, name } = displaySingleCredential
      const claimFields = getOptionalFields(displaySingleCredential)

      return (
        <>
          {isDocument(displaySingleCredential) ? (
            <IncomingRequestDoc
              name={name ?? type}
              holderName={displaySingleCredential.holderName}
              properties={claimFields}
              highlight={`${displaySingleCredential.highlight?.slice(
                0,
                18,
              )}...`}
              photo={displaySingleCredential.photo}
            />
          ) : (
            <IncomingRequestOther
              name={name ?? type}
              properties={claimFields}
            />
          )}
          <Space />
        </>
      )
    } else
      return (
        <>
          <ShareAttributeWidget />
          <Space />
        </>
      )
  }

  return (
    <ContainerBAS>
      <LogoContainerBAS>
        <InteractionLogo />
      </LogoContainerBAS>
      <InteractionTitle label={strings.INCOMING_REQUEST} />
      <InteractionDescription
        label={
          singleMissingAttribute
            ? strings.INTERACTION_DESC_MISSING_SINGLE
            : strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED
        }
      />
      <Space />
      {renderBody()}
      <InteractionFooter
        disabled={!isReadyToSubmit}
        onSubmit={handleSubmit}
        submitLabel={singleMissingAttribute ? strings.ADD_INFO : strings.SHARE}
      />
    </ContainerBAS>
  )
}

const CredentialShareFAS = () => {
  const categories = useSelector(getCustomRequestedCredentialsByCategoryByType)
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

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
          customStyles={{ marginLeft: -5 }}
          renderItem={({ item: cred }) => {
            const claimFields = getOptionalFields(cred)
            const { name, type, id } = cred
            return (
              <TouchableWithoutFeedback
                key={id}
                style={{
                  marginRight: 20,
                  marginVertical: 14,
                }}
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
                      holderName={cred.holderName}
                      highlight={`${cred.highlight?.slice(0, 18)}...`}
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
    <Collapsible>
      <Collapsible.AnimatedHeader height={62}>
        <Collapsible.HeaderText>
          {strings.INCOMING_REQUEST}
        </Collapsible.HeaderText>
      </Collapsible.AnimatedHeader>
      <ContainerFAS>
        <Collapsible.ScrollView withoutHeaderPadding>
          <Collapsible.HidingScale>
            <LogoContainerFAS>
              <InteractionLogo />
            </LogoContainerFAS>
          </Collapsible.HidingScale>
          <Collapsible.HidingTextContainer>
            <ScreenContainer.Padding>
              <InteractionTitle label={strings.INCOMING_REQUEST} />
            </ScreenContainer.Padding>
          </Collapsible.HidingTextContainer>
          <ScreenContainer.Padding>
            <InteractionDescription
              label={
                strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED
              }
            />
          </ScreenContainer.Padding>
          <Space />
          <ScreenContainer.Padding>
            <ShareAttributeWidget withContainer />
          </ScreenContainer.Padding>
          <InteractionSection title={strings.DOCUMENTS} isPaddedTitle={true}>
            {handleRenderCredentials(documents)}
          </InteractionSection>
          <InteractionSection title={strings.OTHER} isPaddedTitle={true}>
            {handleRenderCredentials(other)}
          </InteractionSection>
        </Collapsible.ScrollView>
        <FooterContainerFAS>
          <InteractionFooter
            disabled={!isReadyToSubmit}
            onSubmit={handleSubmit}
            submitLabel={strings.SHARE}
          />
        </FooterContainerFAS>
      </ContainerFAS>
    </Collapsible>
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
