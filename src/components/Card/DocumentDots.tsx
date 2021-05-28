import React, { useMemo } from 'react'

import { useRedirectTo, useRedirect } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { IWithCustomStyle } from './types'
import Dots from '../Dots'
import { useDeleteCredential } from '~/hooks/credentials'

const DocumentDots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { scheduleWarning } = useToasts()
  const redirectToContactUs = useRedirectTo(ScreenNames.ContactUs)
  const redirect = useRedirect()
  const deleteCredential = useDeleteCredential()

  const { id, photo, document, restMandatoryField, optionalFields } = useCard()

  const mandatoryFields = restMandatoryField ? [restMandatoryField] : []
  const claimsDisplay = [...mandatoryFields, ...optionalFields]
  const title = document?.value as string

  const deleteTitle = `${strings.DO_YOU_WANT_TO_DELETE} ${title}?`
  const cancelText = strings.CANCEL
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
        title: strings.INFO,
        navigation: {
          screen: ScreenNames.CardDetails,
          params: {
            fields: claimsDisplay,
            photo,
            title,
          },
        },
      },
      {
        title: strings.DELETE,
        navigation: {
          screen: ScreenNames.DragToConfirm,
          params: {
            title: deleteTitle,
            cancelText,
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
