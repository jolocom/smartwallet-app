import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
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
      default:
        return Colors.success
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
      {children}
    </View>
  )
}

export default ToastContainer
