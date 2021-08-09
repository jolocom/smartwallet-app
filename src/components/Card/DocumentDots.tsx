import React, { useMemo } from 'react'

import { useToasts } from '~/hooks/toasts'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { IWithCustomStyle } from './types'
import Dots from '../Dots'
import { useDeleteCredential } from '~/hooks/credentials'
import useTranslation from '~/hooks/useTranslation'

const DocumentDots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { t } = useTranslation()
  const { scheduleErrorWarning } = useToasts()
  const deleteCredential = useDeleteCredential()

  const { id, photo, document, restMandatoryField, optionalFields } = useCard()

  const mandatoryFields = restMandatoryField ? [restMandatoryField] : []
  const claimsDisplay = [...mandatoryFields, ...optionalFields]
  const title = document?.value as string

  const deleteTitle = `${t('Documents.deleteDocumentHeader', {
    documentName: title,
  })}?`

  const handleDelete = async () => {
    try {
      await deleteCredential(id)
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const popupOptions = useMemo(
    () => [
      {
        title: t('Documents.infoCardOption'),
        navigation: {
          screen: ScreenNames.CredentialDetails,
          params: {
            fields: claimsDisplay,
            photo,
            title,
          },
        },
      },
      {
        title: t('Documents.deleteCardOption'),
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: deleteTitle,
            cancelText: t('Documents.cancelCardOption'),
            instructionText: t('Documents.deleteCredentialInstruction'),
            onComplete: handleDelete,
          },
        },
      },
    ],
    [],
  )

  return (
    <Dots
      customStyles={customStyles}
      color={Colors.black}
      options={popupOptions}
    />
  )
}

export default DocumentDots
