import React, { useCallback, useEffect } from 'react'
import { Text, View } from 'react-native'
import { useSelector } from 'react-redux'
import CollapsedScrollView from '~/components/CollapsedScrollView'
import ShareAttributeWidget from '~/components/Widget/ShareAttributeWidget'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import { useSwitchScreens } from '~/hooks/navigation'
import {
  getCredShareUIDetailsBAS,
  getIsFullscreenCredShare,
  getIsReadyToSubmitRequest,
  getAttributesToSelect,
  getShareCredentialsBySection,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { MultipleShareUICredential } from '~/types/credentials'
import { ScreenNames } from '~/types/screens'
import InteractionDescription from './components/InteractionDescription'
import InteractionFooter from './components/InteractionFooter'
import InteractionLogo from './components/InteractionLogo'
import InteractionSection from './components/InteractionSection'
import InteractionTitle from './components/InteractionTitle'
import {
  AttributeWidgetContainerFAS,
  ContainerBAS,
  ContainerFAS,
  FooterContainerFAS,
  LogoContainerBAS,
  LogoContainerFAS,
  Space,
} from './components/styled'
import Collapsible from '~/components/Collapsible'

const useSelectAttributes = () => {
  const attributesToBeSelected = useSelector(getAttributesToSelect)
  const { handleSelectCredential } = useCredentialShareFlow()
  useEffect(() => {
    handleSelectCredential(attributesToBeSelected)
  }, [JSON.stringify(attributesToBeSelected)])
}

export const CredentialShareBAS = () => {
  const { singleMissingAttribute, singleCredential } = useSelector(
    getCredShareUIDetailsBAS,
  )
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

  const handleShare = useCredentialShareSubmit()
  const handleSwitchScreens = useSwitchScreens(
    ScreenNames.InteractionAddCredential,
  )

  useSelectAttributes()

  const handleSubmit = () =>
    singleMissingAttribute !== undefined
      ? handleSwitchScreens({ type: singleMissingAttribute })
      : handleShare()

  const renderBody = () => {
    if (singleMissingAttribute) return null
    else if (singleCredential !== undefined)
      return (
        <>
          <Text>Incoming Request Card</Text>
          <Space />
        </>
      )
    else
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
          strings.CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED
        }
      />
      <Space />
      {renderBody()}
      <InteractionFooter
        disabled={!isReadyToSubmit}
        onSubmit={handleSubmit}
        submitLabel={
          singleMissingAttribute !== undefined
            ? strings.ADD_INFO
            : strings.SHARE
        }
      />
    </ContainerBAS>
  )
}

const CredentialShareFAS = () => {
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const isReadyToSubmit = useSelector(getIsReadyToSubmitRequest)

  const handleSubmit = useCredentialShareSubmit()

  useSelectAttributes()

  const handleRenderCredentials = (
    credCollections: MultipleShareUICredential[],
  ) =>
    credCollections.map(({ type, credentials }) => {
      const isCarousel = credentials.length > 1
      // TODO: implement carousel
      const Wrapper = isCarousel ? React.Fragment : React.Fragment

      return (
        <Wrapper>
          {credentials.map((cred) => (
            <View
              style={{
                marginRight: 20,
                marginVertical: 14,
              }}
            >
              <Text>{type}</Text>
            </View>
          ))}
        </Wrapper>
      )
    })

  return (
    <ContainerFAS>
      <Collapsible>
        <Collapsible.AnimatedHeader height={62}>
          <Collapsible.HeaderText>
            {strings.INCOMING_REQUEST}
          </Collapsible.HeaderText>
        </Collapsible.AnimatedHeader>
        <Collapsible.ScrollView
          animatedHeader
          customStyles={{ paddingHorizontal: 20 }}
        >
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
              strings.CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED
            }
          />
          <Space />
          <AttributeWidgetContainerFAS>
            <ShareAttributeWidget />
          </AttributeWidgetContainerFAS>
          <InteractionSection title={strings.DOCUMENTS}>
            {handleRenderCredentials(documents)}
          </InteractionSection>
          <InteractionSection title={strings.OTHER}>
            {handleRenderCredentials(other)}
          </InteractionSection>
        </Collapsible.ScrollView>
      </Collapsible>
      <FooterContainerFAS>
        <InteractionFooter
          disabled={!isReadyToSubmit}
          onSubmit={handleSubmit}
          submitLabel={strings.SHARE}
        />
      </FooterContainerFAS>
    </ContainerFAS>
  )
}

const CredentialShare = () => {
  const isFAS = useSelector(getIsFullscreenCredShare)
  return isFAS ? <CredentialShareFAS /> : <CredentialShareBAS />
}

export default CredentialShare
