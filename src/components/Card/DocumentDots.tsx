import React, { useEffect, useMemo, useState } from 'react'

import { useRedirectTo } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { IWithCustomStyle } from './types'
import Dots from '../Dots'
import { useDeleteCredential } from '~/hooks/credentials'
import { useRevertToInitialState } from '~/hooks/generic'

const DocumentDots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { scheduleWarning } = useToasts()
  const redirectToContactUs = useRedirectTo(ScreenNames.ContactUs)
  const deleteCredential = useDeleteCredential()
  const [shouldStartDelete, setShouldStartDelete] = useState(false)

  useRevertToInitialState(shouldStartDelete, setShouldStartDelete)

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

  const handleStartDelete = () => {
    setShouldStartDelete(true)
  }

  useEffect(() => {
    if (shouldStartDelete) {
      ;(async () => {
        await handleDelete()
      })()
    }
  }, [shouldStartDelete])

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
            onComplete: handleStartDelete,
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
