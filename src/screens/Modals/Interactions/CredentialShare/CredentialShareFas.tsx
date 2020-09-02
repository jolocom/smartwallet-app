import React, { useState, useEffect } from 'react'

import FasWrapper from '~/components/ActionSheet/FasWrapper'
import { useSelector } from 'react-redux'
import {
  getShareCredentialsBySection,
  getInteractionDetails,
  getInteractionAttributes,
} from '~/modules/interaction/selectors'
import InteractionSection from '../InteractionSection'
import CredentialCard from '../CredentialCard'
import { MultipleShareUICredential } from '~/types/credentials'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import Carousel from '../Carousel'
import { CredShareI } from '~/modules/interaction/types'
import AttributesWidget from '~/components/AttributesWidget'
import { useSetInteractionAttributes } from '~/hooks/attributes'

const CredentialShareFas = () => {
  const attributes = useSelector(getInteractionAttributes)
  const setInteractionAttributes = useSetInteractionAttributes()
  const { documents, other } = useSelector(getShareCredentialsBySection)
  //FIXME: remove cast after types are fixed
  const [instructionVisible, setInstructionVisibility] = useState(true)
  const [selected, setSelected] = useState<{ type: string; id: string }[]>([])
  console.log({ attributes })

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
      {/* {Object.keys(attributes).length && (
            <AttributesWidget
            attributes={attributes}
            onCreateNewAttr={(sectionKey) =>
            console.log('Creating new attr for', sectionKey)
            }
            isSelectable={true}
            />
            )} */}
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
