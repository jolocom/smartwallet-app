import React from 'react'
import { View } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { Colors } from 'react-native/Libraries/NewAppScreen'

export const BOTTOM_PADDING = 20

const ToastContainer: React.FC = ({ children }) => {
  const { top } = useSafeArea()
  return (
    <View
      style={{
        paddingTop: top + 20,
        backgroundColor: Colors.black65,
        paddingHorizontal: 25,
        paddingBottom: BOTTOM_PADDING,
      }}
    >
      {children}
    </View>
  )
}

export default ToastContainer
