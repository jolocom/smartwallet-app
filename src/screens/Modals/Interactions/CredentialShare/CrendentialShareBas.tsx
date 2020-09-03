import React, { useEffect } from 'react'
import BasWrapper from '~/components/ActionSheet/BasWrapper'
import {
  getFirstShareDocument,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { useSelector, useDispatch } from 'react-redux'
import { getShareAttributes } from '~/modules/interaction/selectors'
import AttributesWidget from '~/components/AttributesWidget'
import { selectShareCredential } from '~/modules/interaction/actions'
import CredentialCard from '../CredentialCard'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'

const CredentialShareBas = () => {
  const shareDocument = useSelector(getFirstShareDocument)
  const attributes = useSelector(getShareAttributes)
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const {
    getPreselectedAttributes,
    handleCreateAttribute,
    handleSelectCredential,
  } = useCredentialShareFlow()

  useEffect(() => {
    shareDocument &&
      handleSelectCredential({ [shareDocument.type]: shareDocument.id })
  }, [])

  useEffect(() => {
    handleSelectCredential(getPreselectedAttributes())
  }, [attributes])

  return (
    <BasWrapper>
      {!shareDocument ? (
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={handleCreateAttribute}
          onSelect={(key, id) => handleSelectCredential({ [key]: id })}
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
