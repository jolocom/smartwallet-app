import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import {
  getFirstShareDocument,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { getAvailableAttributesToShare } from '~/modules/interaction/selectors'
import AttributesWidget from '~/components/AttributesWidget'
import CredentialCard from '../CredentialCard'
import { Colors } from '~/utils/colors'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import { View } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const CredentialShareBas = () => {
  const shareDocument = useSelector(getFirstShareDocument)
  const attributes = useSelector(getAvailableAttributesToShare)
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
  }, [JSON.stringify(Object.values(attributes))])

  const renderContent = () => {
    if (shareDocument) {
      return (
        <CredentialCard>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.middle}
            color={Colors.black}
          >
            {shareDocument.type}
          </JoloText>
        </CredentialCard>
      )
    } else if (getSingleMissingAttribute()) {
      return null
    } else {
      return (
        <View style={{ width: '100%' }}>
          <AttributesWidget
            attributes={attributes}
            onCreateNewAttr={handleCreateAttribute}
            onSelect={(key, id) => handleSelectCredential({ [key]: id })}
            selectedAttributes={selectedCredentials}
            isSelectable={true}
          />
        </View>
      )
    }
  }

  return <BasWrapper>{renderContent()}</BasWrapper>
}

export default CredentialShareBas
