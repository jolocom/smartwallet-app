import React from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import { Colors } from '~/utils/colors'

interface Props {
  isVisible: boolean
  onClose: () => void
  overlayColor?: Colors
  animationType?: 'slide' | 'fade' | 'none'
}

const ActionSheet: React.FC<Props> = ({
  children,
  isVisible,
  onClose,
  overlayColor = Colors.transparent,
  animationType = 'slide',
}) => {
  return (
    <Modal
      animated
      onRequestClose={onClose}
      animationType={animationType}
      transparent={true}
      visible={isVisible}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View
          style={[styles.modalOverlay, { backgroundColor: overlayColor }]}
        />
      </TouchableWithoutFeedback>
      {children}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: StyleSheet.absoluteFillObject,
})

export default ActionSheet
