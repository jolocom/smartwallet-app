import React from 'react'
import { Modal, StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

interface Props {
  show: boolean
  onClose: () => void
}

const ActionSheet: React.FC<Props> = ({ children, show, onClose }) => {
  return (
    <Modal
      animated
      onRequestClose={onClose}
      animationType="slide"
      transparent={true}
      visible={show}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      {children}
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})

export default ActionSheet
