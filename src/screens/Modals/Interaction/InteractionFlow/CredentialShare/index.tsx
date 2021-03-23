import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import React, { useCallback, useEffect } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import CollapsedScrollView from '~/components/CollapsedScrollView'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import { useSwitchScreens } from '~/hooks/navigation'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'
import {
  getRequestedCredentialDetailsBAS,
  getIsFullscreenCredShare,
  getIsReadyToSubmitRequest,
  getCustomRequestedCredentialsByCategoryByType,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import {
  isDocument,
  RequestedCredentialsByType,
  OtherCategory,
  DisplayCredential,
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

export const CredentialShareBAS = () => {
  const { singleRequestedAttribute, singleRequestedCredential } = useSelector(
    getRequestedCredentialDetailsBAS,
  )
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

  const handleShare = useCredentialShareSubmit()
  const handleSwitchScreens = useSwitchScreens(
    ScreenNames.InteractionAddCredential,
  )

  const { handleSelectCredential } = useCredentialShareFlow()

  /* We are preselecting a credential that is requested */
  useEffect(() => {
    if (singleRequestedCredential) {
      handleSelectCredential({
        [singleRequestedCredential.type[1]]: singleRequestedCredential?.id,
      })
    }
  }, [JSON.stringify(singleRequestedCredential)])

  const handleSubmit = () =>
    singleRequestedAttribute !== undefined
      ? handleSwitchScreens({ type: singleRequestedAttribute })
      : handleShare()

  const renderBody = () => {
    if (singleRequestedAttribute) return null
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
          strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED
        }
      />
      <Space />
      {renderBody()}
      <InteractionFooter
        disabled={!isReadyToSubmit}
        onSubmit={handleSubmit}
        submitLabel={
          singleRequestedAttribute !== undefined
            ? strings.ADD_INFO
            : strings.SHARE
        }
      />
    </ContainerBAS>
  )
}

const CredentialShareFAS = () => {
  const categories = useSelector(getCustomRequestedCredentialsByCategoryByType)
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

  const handleSubmit = useCredentialShareSubmit()

  const documents = categories[CredentialRenderTypes.document]
  const other = categories[OtherCategory.other]

  const handleRenderCredentials = (
    credCollections: RequestedCredentialsByType<DisplayCredential>[],
  ) =>
    credCollections.map(({ type, credentials }) => {
      const isCarousel = credentials.length > 1
      // TODO: implement carousel
      const Wrapper = isCarousel ? React.Fragment : React.Fragment
      return (
        <Wrapper key={type}>
          {credentials.map((cred) => {
            const claimFields = getOptionalFields(cred)
            const { name, type } = cred
            return (
              <View
                key={cred.id}
                style={{
                  marginRight: 20,
                  marginVertical: 14,
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
              </View>
            )
          })}
        </Wrapper>
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
        <Collapsible.ScrollView customStyles={{ paddingHorizontal: '5%' }}>
          <Collapsible.HidingScale>
            <LogoContainerFAS>
              <InteractionLogo />
            </LogoContainerFAS>
          </Collapsible.HidingScale>
          <Collapsible.HidingTextContainer>
            <InteractionTitle label={strings.INCOMING_REQUEST} />
          </Collapsible.HidingTextContainer>
          <InteractionDescription
            label={
              strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED
            }
          />
          <Space />
          <ShareAttributeWidget withContainer />
          <InteractionSection title={strings.DOCUMENTS}>
            {handleRenderCredentials(documents)}
          </InteractionSection>
          <InteractionSection title={strings.OTHER}>
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

export default CredentialShare
