import React from 'react'
import { StyleSheet, View } from 'react-native'
import { IWithCustomStyle } from '~/types/props'
import { Colors } from '~/utils/colors'
import ScreenDismissArea from './ScreenDismissArea'

interface BottomSheetProps extends IWithCustomStyle {
  onDismiss?: () => void
}

// NOTE: the hight of the sheet will depend on the children
const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  onDismiss,
  customStyles,
}) => {
  return (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={onDismiss} />
      <View style={[styles.interactionBody, customStyles]}>{children}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.black65,
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})

export default BottomSheet
