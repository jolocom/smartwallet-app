import React from 'react'
import { StyleSheet } from 'react-native'
import { TouchableWithoutFeedback, View } from 'react-native'

interface IScreenDismissArea {
  onDismiss?: () => void
}

const ScreenDismissArea: React.FC<IScreenDismissArea> = ({ onDismiss }) => {
  const handleDismiss = () => {
    onDismiss && onDismiss()
  }
  return (
    <TouchableWithoutFeedback onPress={handleDismiss}>
      <View style={styles.tapArea} />
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  tapArea: {
    flex: 1,
    width: '100%',
  },
})

export default ScreenDismissArea
