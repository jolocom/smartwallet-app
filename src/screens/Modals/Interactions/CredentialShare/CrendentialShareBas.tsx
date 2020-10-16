import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'

import BasWrapper, {
  BasInteractionBody,
} from '~/components/ActionSheet/BasWrapper'
import {
  getFirstShareDocument,
  getSelectedShareCredentials,
} from '~/modules/interaction/selectors'
import { getAvailableAttributesToShare } from '~/modules/interaction/selectors'
import AttributesWidget from '~/components/AttributesWidget'
import CredentialCard from '../CredentialCard'
import { Colors } from '~/utils/colors'
import { useCredentialShareFlow } from '~/hooks/interactions/useCredentialShareFlow'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import InteractionHeader from '../InteractionHeader'
import InteractionFooter from '../InteractionFooter'
import useCredentialShareSubmit from '~/hooks/interactions/useCredentialShareSubmit'

const CredentialShareBas = () => {
  const shareDocument = useSelector(getFirstShareDocument)
  const attributes = useSelector(getAvailableAttributesToShare)
  const selectedCredentials = useSelector(getSelectedShareCredentials)
  const {
    getPreselectedAttributes,
    handleCreateAttribute,
    handleSelectCredential,
    getSingleMissingAttribute,
    getHeaderText,
    getCtaText,
    selectionReady,
  } = useCredentialShareFlow()
  const hasMissingAttribute = getSingleMissingAttribute()

  const handleSubmit = useCredentialShareSubmit()

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

  return (
    <BasWrapper>
      <InteractionHeader {...getHeaderText()} />
      {!hasMissingAttribute && (
        <BasInteractionBody>{renderContent()}</BasInteractionBody>
      )}
      <InteractionFooter
        disabled={hasMissingAttribute ? false : !selectionReady()}
        cta={getCtaText()}
        onSubmit={() => {
          return hasMissingAttribute
            ? handleCreateAttribute(hasMissingAttribute)
            : handleSubmit()
        }}
      />
    </BasWrapper>
  )
}

export default CredentialShareBas
