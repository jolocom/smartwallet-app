import React, { useMemo } from 'react'

import { useRedirectTo } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { IWithCustomStyle } from './types'
import Dots from '../Dots'
import { useDeleteCredential } from '~/hooks/credentials'
import useTranslation from '~/hooks/useTranslation'

const DocumentDots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { t } = useTranslation()
  const { scheduleWarning } = useToasts()
  const redirectToContactUs = useRedirectTo(ScreenNames.ContactUs)
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
      scheduleWarning({
        title: strings.WHOOPS,
        message: strings.ERROR_TOAST_MSG,
        interact: {
          label: strings.REPORT,
          onInteract: redirectToContactUs, // TODO: change to Reporting screen once available
        },
      })
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
