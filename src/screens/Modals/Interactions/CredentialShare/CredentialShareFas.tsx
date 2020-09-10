import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import {
  getShareCredentialsBySection,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { MultipleShareUICredential } from '~/types/credentials'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import Carousel from '../Carousel'
import AttributesWidget from '~/components/AttributesWidget'
import { getShareAttributes } from '~/modules/interaction/selectors'
import InteractionFooter from '../InteractionFooter'
import AttributeWidgetWrapper from './AttributeWidgetWrapper'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { strings } from '~/translations/strings'
import { isCredShareDetails } from '~/modules/interaction/guards'

const CredentialShareFas = () => {
  const attributes = useSelector(getShareAttributes)
  const details = useSelector(getInteractionDetails)
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [shouldShowInstruction, setShouldShowInstruction] = useState(true)
  const {
    getPreselectedAttributes,
    selectionReady,
    isFirstCredential,
    handleSelectCredential,
    handleCreateAttribute,
  } = useCredentialShareFlow()

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

  const renderCredentials = (credCollections: MultipleShareUICredential[]) =>
    credCollections.map(({ type, credentials }) => {
      const isCarousel = credentials.length > 1
      const Wrapper = isCarousel ? Carousel : React.Fragment

      return (
        <View style={{ marginLeft: isCarousel ? 0 : 27 }}>
          <Wrapper>
            {credentials.map((cred) => (
              <View style={{ marginRight: 20, marginVertical: 14 }}>
                <CredentialCard
                  isSmall
                  hasInstruction={
                    instructionVisible && isFirstCredential(cred.id)
                  }
                  onSelect={() => {
                    shouldShowInstruction && setShouldShowInstruction(false)
                    handleSelectCredential({ [cred.type]: cred.id })
                  }}
                  selected={
                    isCredShareDetails(details) &&
                    details.selectedCredentials[cred.type] === cred.id
                  }
                >
                  <Header color={Colors.black}>{type}</Header>
                </CredentialCard>
              </View>
            ))}
          </Wrapper>
        </View>
      )
    })

  return (
    <>
      <FasWrapper>
        {!!Object.keys(attributes).length && (
          <AttributeWidgetWrapper>
            <AttributesWidget
              attributes={attributes}
              onCreateNewAttr={handleCreateAttribute}
              onSelect={(key, id) => handleSelectCredential({ [key]: id })}
              selectedAttributes={
                isCredShareDetails(details) ? details.selectedCredentials : {}
              }
              isSelectable={true}
            />
          </AttributeWidgetWrapper>
        )}
        <InteractionSection
          visible={!!documents.length}
          title={strings.DOCUMENTS}
        >
          {renderCredentials(documents)}
        </InteractionSection>
        <InteractionSection visible={!!other.length} title={strings.OTHER}>
          {renderCredentials(other)}
        </InteractionSection>
      </FasWrapper>
      <InteractionFooter disabled={!selectionReady()} />
    </>
  )
}

export default CredentialShareFas
