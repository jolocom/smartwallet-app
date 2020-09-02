import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { useSelector, useDispatch } from 'react-redux'
import {
  getShareCredentialsBySection,
  getSelectedAttributes,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { MultipleShareUICredential, AttrKeys } from '~/types/credentials'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import Carousel from '../Carousel'
import { IntermediaryState } from '~/modules/interaction/types'
import AttributesWidget from '~/components/AttributesWidget'
import {
  setIntermediaryState,
  setAttributeInputKey,
  selectAttr,
} from '~/modules/interaction/actions'
import { getShareAttributes } from '~/modules/attributes/selectors'

const CredentialShareFas = () => {
  const dispatch = useDispatch()
  const attributes = useSelector(getShareAttributes)
  const selectedAttributes = useSelector(getSelectedAttributes)
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [shouldShowInstruction, setShouldShowInstruction] = useState(true)

  const isFirstCredential = (id: string) => {
    if (documents.length) {
      return id === documents[0].credentials[0].id
    } else {
      return id === other[0].credentials[0].id
    }
  }

  useEffect(() => {
    const preselectedAttrs = Object.keys(attributes).reduce<{
      [key: string]: string
    }>((acc, v) => {
      const value = v as AttrKeys
      if (!acc[value]) {
        const attr = attributes[value] || []
        acc[value] = attr.length ? attr[0].id : ''
      }
      return acc
    }, {})

    dispatch(selectAttr(preselectedAttrs))
  }, [])

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
                dispatch(selectAttr({ [cred.type]: cred.id }))
              }}
              selected={selectedAttributes[cred.type] === cred.id}
            >
              <Header color={Colors.black}>{type}</Header>
            </CredentialCard>
          ))}
        </Wrapper>
      )
    })

  return (
    <FasWrapper>
      {!!Object.keys(attributes).length && (
        <View
          style={{
            marginHorizontal: 17,
            paddingHorizontal: 20,
            paddingTop: 20,
            backgroundColor: 'rgb(9,9,9)',
            borderRadius: 20,
            marginBottom: 46,
            //shadows
            shadowColor: 'rgba(0, 0, 0, 0.5)',
            shadowOffset: {
              width: 0,
              height: -2,
            },
            shadowRadius: 14,
            shadowOpacity: 1,
            elevation: 10,
          }}
        >
          <AttributesWidget
            attributes={attributes}
            onCreateNewAttr={(sectionKey) => {
              dispatch(setIntermediaryState(IntermediaryState.showing))
              dispatch(setAttributeInputKey(sectionKey))
            }}
            isSelectable={true}
          />
        </View>
      )}
      <InteractionSection visible={!!documents.length} title={'Documents'}>
        {renderCredentials(documents)}
      </InteractionSection>
      <InteractionSection visible={!!other.length} title={'Others'}>
        {renderCredentials(other)}
      </InteractionSection>
    </FasWrapper>
  )
}

export default CredentialShareFas
