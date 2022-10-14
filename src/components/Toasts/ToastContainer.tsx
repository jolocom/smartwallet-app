import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { ToastType } from '~/types/toasts'
import { Colors } from '~/utils/colors'
import { useToastToShow } from './context'
import { ErrorToastIcon, InfoToastIcon, SuccessToastIcon } from '~/assets/svg'

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
        backgroundColor: Colors.black,
        paddingVertical: 24,
        paddingHorizontal: 21,
        flexDirection: 'row',
        width: '94%',
        borderColor: getBorderColor(toastToShow?.type),
        borderRadius: 16,
        borderWidth: 2,
        marginTop: top,
        alignSelf: 'center',
        alignItems: 'center',
      }}
    >
      {getToastIcon(toastToShow?.type)}
      <View style={{ flex: 1, marginLeft: 23 }}>{children}</View>
    </View>
  )
}

export default ToastContainer
