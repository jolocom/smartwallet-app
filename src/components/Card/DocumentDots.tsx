import React, { useMemo, useRef } from 'react'
import { StyleSheet } from 'react-native'

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

  const { id, photo, claims, document } = useCard()
  const infoRef = useRef<{ show: () => void }>(null)

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
        fields={claims}
        photo={photo}
        title={document?.value as string}
      />
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  dots: {
    flexDirection: 'row',
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.black,
    marginHorizontal: 2,
  },
})

export default DocumentDots
