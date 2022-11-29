import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { ErrorToastIcon, InfoToastIcon, SuccessToastIcon } from '~/assets/svg'
import { ToastType } from '~/types/toasts'
import { Colors } from '~/utils/colors'
import { useToastToShow } from './context'

export const BOTTOM_PADDING = 20

const ToastContainer: React.FC = ({ children }) => {
  const { top } = useSafeArea()
  const { toastToShow } = useToastToShow()

  const getBorderColor = (type: ToastType | undefined) => {
    switch (type) {
      case ToastType.warning:
        return Colors.error
      case ToastType.info:
        return Colors.white
      case ToastType.success:
        return Colors.success
      default:
        return Colors.error
    }
  }

  const getToastIcon = (type: ToastType | undefined) => {
    switch (type) {
      case ToastType.warning:
        return <ErrorToastIcon />
      case ToastType.info:
        return <InfoToastIcon />
      case ToastType.success:
        return <SuccessToastIcon />
      default:
        return <ErrorToastIcon />
    }
  }

  return (
    <View
      style={{
        ...styles.toastContainer,
        borderColor: getBorderColor(toastToShow?.type),
        marginTop: top,
      }}
    >
      {getToastIcon(toastToShow?.type)}
      <View style={styles.toastContent}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  toastContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.black,
    borderRadius: 16,
    borderWidth: 2,
    flexDirection: 'row',
    paddingVertical: 24,
    paddingHorizontal: 21,
    width: '94%',
  },
  toastContent: {
    flex: 1,
    marginLeft: 23,
  },
})

export default ToastContainer
