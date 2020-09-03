import React, { useState, useEffect } from 'react'
import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { useSelector, useDispatch } from 'react-redux'
import {
  getShareCredentialsBySection,
  getSelectedShareCredentials,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { MultipleShareUICredential, AttrKeys } from '~/types/credentials'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import Carousel from '../Carousel'
import { IntermediaryState, CredShareI } from '~/modules/interaction/types'
import AttributesWidget from '~/components/AttributesWidget'
import {
  setIntermediaryState,
  setAttributeInputKey,
  selectShareCredential,
} from '~/modules/interaction/actions'
import { getShareAttributes } from '~/modules/interaction/selectors'
import { useRootSelector } from '~/hooks/useRootSelector'
import InteractionFooter from '../InteractionFooter'
import AttributeWidgetWrapper from './AttributeWidgetWrapper'

const CredentialShareFas = () => {
  const dispatch = useDispatch()
  const attributes = useSelector(getShareAttributes)
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [shouldShowInstruction, setShouldShowInstruction] = useState(true)
  const {
    credentials: { service_issued },
  } = useRootSelector<CredShareI>(getInteractionDetails)

  const isFirstCredential = (id: string) => {
    if (documents.length) {
      return id === documents[0].credentials[0].id
    } else {
      return id === other[0].credentials[0].id
    }
  }

  const areAllSelected = () => {
    const allAttributes = Object.keys(attributes).every((t) =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    const allCredentials = service_issued.every((t) =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    return allAttributes && allCredentials
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

    dispatch(selectShareCredential(preselectedAttrs))
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
                dispatch(selectShareCredential({ [cred.type]: cred.id }))
              }}
              selected={selectedShareCredentials[cred.type] === cred.id}
            >
              <Header color={Colors.black}>{type}</Header>
            </CredentialCard>
          ))}
        </Wrapper>
      )
    })

  return (
    <>
      <FasWrapper>
        {!!Object.keys(attributes).length && (
          <AttributeWidgetWrapper>
            <AttributesWidget
              attributes={attributes}
              onCreateNewAttr={(sectionKey) => {
                dispatch(setIntermediaryState(IntermediaryState.showing))
                dispatch(setAttributeInputKey(sectionKey))
              }}
              onSelect={(key, id) =>
                dispatch(selectShareCredential({ [key]: id }))
              }
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
      <InteractionFooter disabled={!areAllSelected()} />
    </>
  )
}

export default CredentialShareFas
