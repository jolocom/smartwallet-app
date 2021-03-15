import React, { useCallback } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'
import CollapsedScrollView from '~/components/CollapsedScrollView'
import ShareAttributeWidget from '~/components/Widget/ShareAttributeWidget'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import { useSwitchScreens } from '~/hooks/navigation'
import {
  getCredShareUIDetailsBAS,
  getIsFullscreenCredShare,
  getIsReadyToSubmitRequest,
  getShareCredentialsBySection,
} from '~/modules/interaction/selectors'
import { strings } from '~/translations'
import { MultipleShareUICredential } from '~/types/credentials'
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
import { useSelectAttributes } from './useShare'

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
    else if (singleCredential !== undefined) {
      // TODO: is there enum for documents? others? permissions?
      const {
        renderInfo,
        type,
        name,
        properties,
        holderName,
        photo,
      } = singleCredential
      return (
        <>
          {/* TODO: use enum */}
          {renderInfo.renderAs === 'document' ? (
            <IncomingRequestDoc
              name={name ?? type}
              holderName={holderName}
              // @ts-expect-error until types in sdk are fixed
              properties={properties}
              // TODO: extract highlight
              // highlight={id}
              // TODO: change name to photo
              image={photo}
            />
          ) : (
            <IncomingRequestOther
              name={name ?? type}
              // @ts-expect-error until types in sdk are fixed
              properties={properties}
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

  const handleRenderCollapsingComponent = useCallback(
    () => (
      <LogoContainerFAS>
        <InteractionLogo />
      </LogoContainerFAS>
    ),
    [],
  )

  const handleRenderCredentials = (
    credCollections: MultipleShareUICredential[],
  ) =>
    credCollections.map(({ type, credentials }) => {
      console.log({ credentials })

      const isCarousel = credentials.length > 1
      // TODO: implement carousel
      const Wrapper = isCarousel ? React.Fragment : React.Fragment
      return (
        <Wrapper key={type}>
          {credentials.map((cred) => {
            const { name, type, properties, photo } = cred
            return (
              <View
                key={cred.id}
                style={{
                  marginRight: 20,
                  marginVertical: 14,
                }}
              >
                {/* TODO: check if enum is available for documents, others, permissions */}
                {cred.renderInfo?.renderAs === 'document' ? (
                  <IncomingRequestDoc
                    name={name ?? type}
                    // @ts-expect-error until types are fixed in sdk
                    properties={properties}
                    holderName={cred.holderName}
                    highlight={cred.id}
                    image={cred.photo}
                  />
                ) : (
                  <IncomingRequestOther
                    name={name ?? type}
                    // @ts-expect-error until types are fixed in sdk
                    properties={properties}
                  />
                )}
              </View>
            )
          })}
        </Wrapper>
      )
    })

  return (
    <ContainerFAS>
      <CollapsedScrollView
        collapsedTitle={strings.INCOMING_REQUEST}
        renderCollapsingComponent={handleRenderCollapsingComponent}
      >
        <InteractionTitle label={strings.INCOMING_REQUEST} />
        <InteractionDescription
          label={
            strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_REQUESTED_BY_SERVICE_TO_PROCEED
          }
        />
        <Space />
        <ShareAttributeWidget />
        <InteractionSection title={strings.DOCUMENTS}>
          {handleRenderCredentials(documents)}
        </InteractionSection>
        <InteractionSection title={strings.OTHER}>
          {handleRenderCredentials(other)}
        </InteractionSection>
      </CollapsedScrollView>
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
