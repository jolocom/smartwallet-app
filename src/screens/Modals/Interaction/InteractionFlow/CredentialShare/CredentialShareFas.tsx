import React, { useState, useEffect, useCallback } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import {
  getShareCredentialsBySection,
  getAvailableAttributesToShare,
  getCredShareDetails,
} from '~/modules/interaction/selectors'
import InteractionSection from '../components/InteractionSection'
import CredentialCard from '../components/CredentialCard'
import { MultipleShareUICredential } from '~/types/credentials'
import { Colors } from '~/utils/colors'
import Carousel from '../components/Carousel'
import InteractionFooter, { FooterContainer } from '../components/InteractionFooter'
import AttributeWidgetWrapper from './AttributeWidgetWrapper'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { strings } from '~/translations/strings'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../components/InteractionHeader'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'
import ShareAttributeWidget from '~/components/Widget/ShareAttributeWidget'

const CredentialShareFas = () => {
  const attributes = useSelector(getAvailableAttributesToShare)
  const details = useSelector(getCredShareDetails)
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [shouldShowInstruction, setShouldShowInstruction] = useState(true)
  const {
    getPreselectedAttributes,
    isFirstCredential,
    handleSelectCredential,
    selectionReady,
    getHeaderText,
    getCtaText,
  } = useCredentialShareFlow()
  const handleSubmit = useCredentialShareSubmit()

  useEffect(() => {
    handleSelectCredential(getPreselectedAttributes())
  }, [JSON.stringify(Object.values(attributes))])

  useEffect(() => {
    const id = setTimeout(() => {
      setInstructionVisibility(false)
    }, 5000)

    if (!shouldShowInstruction) {
      setInstructionVisibility(false)
      clearTimeout(id)
    }

    return () => {
      clearTimeout(id)
    }
  }, [shouldShowInstruction])

  const handleSelectCard = useCallback(
    (type: string, id: string) => {
      shouldShowInstruction && setShouldShowInstruction(false)
      handleSelectCredential({ [type]: id })
    },
    [shouldShowInstruction],
  )

  const renderSectionCredentials = (
    credCollections: MultipleShareUICredential[],
  ) =>
    credCollections.map(({ type, credentials }) => {
      const isCarousel = credentials.length > 1
      const Wrapper = isCarousel ? Carousel : React.Fragment

      return (
        <Wrapper>
          {credentials.map((cred) => (
            <View
              style={{
                marginRight: 20,
                marginVertical: 14,
              }}
            >
              <CredentialCard
                isSmall
                hasInstruction={
                  instructionVisible && isFirstCredential(cred.id)
                }
                onSelect={() => handleSelectCard(cred.type, cred.id)}
                selected={details.selectedCredentials[cred.type] === cred.id}
              >
                <JoloText
                  kind={JoloTextKind.title}
                  size={JoloTextSizes.middle}
                  color={Colors.black}
                >
                  {type}
                </JoloText>
              </CredentialCard>
            </View>
          ))}
        </Wrapper>
      )
    })

  return (
    <>
      <FasWrapper collapsedTitle={getHeaderText().title}>
        <InteractionHeader {...getHeaderText()} />
        {!!Object.keys(attributes).length && (
          <AttributeWidgetWrapper>
            <ShareAttributeWidget />
          </AttributeWidgetWrapper>
        )}
        <InteractionSection
          visible={!!documents.length}
          title={strings.DOCUMENTS}
        >
          {renderSectionCredentials(documents)}
        </InteractionSection>
        <InteractionSection visible={!!other.length} title={strings.OTHER}>
          {renderSectionCredentials(other)}
        </InteractionSection>
      </FasWrapper>
      <FooterContainer>
        <InteractionFooter
          cta={getCtaText()}
          disabled={!selectionReady()}
          onSubmit={handleSubmit}
        />
      </FooterContainer>
    </>
  )
}

export default CredentialShareFas
