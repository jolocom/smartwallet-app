import React, { useMemo, useRef } from 'react'

import { useRedirectTo } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import { useCard } from './context'
import { IWithCustomStyle } from './types'
import CardDetails from '~/screens/LoggedIn/Documents/CardDetails'
import Dots from '../Dots'
import { useDeleteCredential } from '~/hooks/credentials'

const DocumentDots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { scheduleWarning } = useToasts()
  const redirectToContactUs = useRedirectTo(ScreenNames.ContactUs)
  const deleteCredential = useDeleteCredential()

  const { id, photo, document, restMandatoryField, optionalFields } = useCard()
  const infoRef = useRef<{ show: () => void }>(null)

  const mandatoryFields = restMandatoryField ? [restMandatoryField] : []
  const claimsDisplay = [...mandatoryFields, ...optionalFields]

  const deleteTitle = `${strings.DO_YOU_WANT_TO_DELETE} ${document?.value}?`
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

  const redirectToDelete = useRedirectTo(ScreenNames.DragToConfirm, {
    title: deleteTitle,
    cancelText,
    onComplete: handleDelete,
  })

  const popupOptions = useMemo(
    () => [
      {
        title: strings.INFO,
        onPress: () => infoRef.current?.show(),
      },
      { title: strings.DELETE, onPress: redirectToDelete },
    ],
    [],
  )

  return (
    <>
      <Dots
        customStyles={customStyles}
        color={Colors.black}
        options={popupOptions}
      />
      <CardDetails
        ref={infoRef}
        fields={claimsDisplay}
        photo={photo}
        title={document?.value as string}
      />
    </>
  )
}

export default DocumentDots
