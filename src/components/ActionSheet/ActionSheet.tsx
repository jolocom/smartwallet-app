import React from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

interface Props {
  isVisible: boolean
  onClose: () => void
}

const ActionSheet: React.FC<Props> = ({ children, isVisible, onClose }) => {
  return (
    <Modal
      animated
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      {children}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: StyleSheet.absoluteFillObject,
})

export default ActionSheet
