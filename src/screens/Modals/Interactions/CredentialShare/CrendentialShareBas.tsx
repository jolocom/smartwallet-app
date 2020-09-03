import React, { useEffect } from 'react'
import BasWrapper from '~/components/ActionSheet/BasWrapper'
import {
  getFirstShareDocument,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { getShareAttributes } from '~/modules/interaction/selectors'
import AttributeWidgetWrapper from './AttributeWidgetWrapper'
import AttributesWidget from '~/components/AttributesWidget'
import {
  setIntermediaryState,
  setAttributeInputKey,
  selectShareCredential,
} from '~/modules/interaction/actions'
import { IntermediaryState } from '~/modules/interaction/types'
import CredentialCard from '../CredentialCard'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { AttrKeys } from '~/types/credentials'

const CredentialShareBas = () => {
  const shareDocument = useSelector(getFirstShareDocument)
  const attributes = useSelector(getShareAttributes)
  const dispatch = useDispatch()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)

  useEffect(() => {
    shareDocument &&
      dispatch(
        selectShareCredential({ [shareDocument.type]: shareDocument.id }),
      )
  }, [])

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

  return (
    <BasWrapper>
      {!shareDocument ? (
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={(sectionKey) => {
            dispatch(setIntermediaryState(IntermediaryState.showing))
            dispatch(setAttributeInputKey(sectionKey))
          }}
          onSelect={(key, id) => dispatch(selectShareCredential({ [key]: id }))}
          selectedAttributes={selectedShareCredentials}
          isSelectable={true}
        />
      ) : (
        <CredentialCard>
          <Header color={Colors.black}>{shareDocument.type}</Header>
        </CredentialCard>
      )}
    </BasWrapper>
  )
}

export default CredentialShareBas
