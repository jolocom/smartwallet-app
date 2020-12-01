import React, { useRef } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { useRedirectTo } from '~/hooks/navigation'
import { useToasts } from '~/hooks/toasts'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import PopupMenu from '../PopupMenu'
import { useCard } from './Card'
import { IWithCustomStyle } from './types'

const deleteDocMock = (id: string | number): Promise<string> => {
  return new Promise((res, rej) => {
    // res('Success, deleted')
    rej('Failure to delete')
  })
}

const Dots: React.FC<IWithCustomStyle> = ({ customStyles }) => {
  const { id, document } = useCard()
  const { scheduleWarning } = useToasts()
  const redirectToContactUs = useRedirectTo(ScreenNames.ContactUs)

  const popupRef = useRef<{ show: () => void }>(null)

  const deleteTitle = `${strings.DO_YOU_WANT_TO_DELETE} ${document?.name}?`
  const cancelText = strings.CANCEL
  const handleDelete = async () => {
    try {
      await deleteDocMock(id)
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

  return (
    <TouchableOpacity
      onPress={() => popupRef.current?.show()}
      style={[styles.container, customStyles]}
      testID="card-action-more"
    >
      <View style={styles.dots}>
        {[...Array(3).keys()].map((c) => (
          <View key={c} style={styles.dot} />
        ))}
      </View>
      <PopupMenu
        ref={popupRef}
        options={[
          { title: strings.INFO, onPress: () => {} },
          { title: strings.DELETE, onPress: redirectToDelete },
        ]}
      />
    </TouchableOpacity>
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

export default Dots
