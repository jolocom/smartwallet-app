import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import ScreenDismissArea from './ScreenDismissArea'

interface BottomSheetProps {
  onDismiss?: () => void
}

// NOTE: the hight of the sheet will depend on the children
const BottomSheet: React.FC<BottomSheetProps> = ({ children, onDismiss }) => {
  return (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={onDismiss} />
      <View style={styles.interactionBody}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black65,
  },
  tapArea: {
    flex: 1,
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})

export default BottomSheet
