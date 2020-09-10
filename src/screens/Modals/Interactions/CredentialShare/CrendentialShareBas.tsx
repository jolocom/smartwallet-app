import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import {
  getFirstShareDocument,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { getShareAttributes } from '~/modules/interaction/selectors'
import AttributesWidget from '~/components/AttributesWidget'
import CredentialCard from '../CredentialCard'
import Header from '~/components/Header'
import { Colors } from '~/utils/colors'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'

const CredentialShareBas = () => {
  const shareDocument = useSelector(getFirstShareDocument)
  const attributes = useSelector(getShareAttributes)
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  const {
    getPreselectedAttributes,
    handleCreateAttribute,
    handleSelectCredential,
    getSingleMissingAttribute,
  } = useCredentialShareFlow()

  useEffect(() => {
    shareDocument &&
      handleSelectCredential({ [shareDocument.type]: shareDocument.id })
  }, [])

  useEffect(() => {
    handleSelectCredential(getPreselectedAttributes())
  }, [attributes])

  const renderContent = () => {
    if (shareDocument) {
      return (
        <CredentialCard>
          <Header color={Colors.black}>{shareDocument.type}</Header>
        </CredentialCard>
      )
    } else if (getSingleMissingAttribute()) {
      return null
    } else {
      return (
        <AttributesWidget
          attributes={attributes}
          onCreateNewAttr={handleCreateAttribute}
          onSelect={(key, id) => handleSelectCredential({ [key]: id })}
          selectedAttributes={selectedCredentials}
          isSelectable={true}
        />
      )
    }
  }

  return <BasWrapper>{renderContent()}</BasWrapper>
}

export default CredentialShareBas
