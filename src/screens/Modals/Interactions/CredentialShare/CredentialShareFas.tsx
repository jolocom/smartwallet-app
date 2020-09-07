import React, { useState, useEffect } from 'react'
import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { useSelector } from 'react-redux'
import {
  getShareCredentialsBySection,
  getSelectedShareCredentials,
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

const CredentialShareFas = () => {
  const attributes = useSelector(getShareAttributes)
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
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
  }, [attributes])

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
        <Wrapper>
          {credentials.map((cred) => (
            <CredentialCard
              isSmall
              hasInstruction={instructionVisible && isFirstCredential(cred.id)}
              onSelect={() => {
                shouldShowInstruction && setShouldShowInstruction(false)
                handleSelectCredential({ [cred.type]: cred.id })
              }}
              selected={selectedShareCredentials[cred.type] === cred.id}
            >
              <Header color={Colors.black}>{type}</Header>
            </CredentialCard>
          ))}
        </Wrapper>
      )
    })

  //TODO: add strings
  return (
    <>
      <FasWrapper>
        {!!Object.keys(attributes).length && (
          <AttributeWidgetWrapper>
            <AttributesWidget
              attributes={attributes}
              onCreateNewAttr={handleCreateAttribute}
              onSelect={(key, id) => handleSelectCredential({ [key]: id })}
              selectedAttributes={selectedShareCredentials}
              isSelectable={true}
            />
          </AttributeWidgetWrapper>
        )}
        <InteractionSection visible={!!documents.length} title={'Documents'}>
          {renderCredentials(documents)}
        </InteractionSection>
        <InteractionSection visible={!!other.length} title={'Others'}>
          {renderCredentials(other)}
        </InteractionSection>
      </FasWrapper>
      <InteractionFooter disabled={!selectionReady()} />
    </>
  )
}

export default CredentialShareFas
