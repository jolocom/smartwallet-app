import React, { useState, useEffect } from 'react'
import { View } from 'react-native'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { useSelector, useDispatch } from 'react-redux'
import {
  getShareCredentialsBySection,
  getInteractionDetails,
  getInteractionAttributes,
  getSelectedAttributes,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import {
  MultipleShareUICredential,
  ATTR_TYPES,
  attrTypeToAttrKey,
} from '~/types/credentials'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import Carousel from '../Carousel'
import { CredShareI, IntermediaryState } from '~/modules/interaction/types'
import AttributesWidget from '~/components/AttributesWidget'
import { useSetInteractionAttributes } from '~/hooks/attributes'
import {
  setIntermediaryState,
  setAttributeInputKey,
} from '~/modules/interaction/actions'
import { getShareAttributes } from '~/modules/attributes/selectors'

const CredentialShareFas = () => {
  const dispatch = useDispatch()
  const attributes = useSelector(getShareAttributes)
  const selectedAttributes = useSelector(getSelectedAttributes)
  const setInteractionAttributes = useSetInteractionAttributes()
  const { documents, other } = useSelector(getShareCredentialsBySection)
  //FIXME: remove cast after types are fixed
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [selected, setSelected] = useState<{ type: string; id: string }[]>([])

  const isFirstCredential = (id: string) => {
    if (documents.length) {
      return id === documents[0].credentials[0].id
    } else {
      return id === other[0].credentials[0].id
    }
  }

  const isTypeSelected = (t: string) => selected.map((c) => c.type).includes(t)

  /* const isSubmitReady = () => {
     *   const allService = service_issued.every(isTypeSelected)
     *   const allSelf = self_issued.every(isTypeSelected)

     *   return allService && allSelf
     * } */

  useEffect(() => {
    setInteractionAttributes()
  }, [])

  useEffect(() => {
    let id: ReturnType<typeof setTimeout> | undefined = undefined
    if (!selected.length) {
      id = setTimeout(() => {
        setInstructionVisibility(false)
      }, 5000)
    } else if (id && selected.length) {
      setInstructionVisibility(false)
      clearTimeout(id)
    }

    return () => {
      id && clearTimeout(id)
    }
  }, [selected])

  const onSelect = (type: string, id: string) => {
    setSelected((prevSel) => {
      const newSel = prevSel
      const isSameType = prevSel.map((c) => c.type).includes(type)
      const isSameId = prevSel.map((c) => c.id).includes(id)

      if (isSameType) {
        if (isSameId) {
          return newSel.filter((c) => c.type !== type)
        } else {
          return [...newSel.filter((c) => c.type !== type), { type, id }]
        }
      } else {
        return [...newSel, { type, id }]
      }
    })
  }

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
              onSelect={() => onSelect(type, cred.id)}
              selected={selected.map((c) => c.id).includes(cred.id)}
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
