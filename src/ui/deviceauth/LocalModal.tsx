import React from 'react'
import { Modal } from 'react-native'

interface PropsI {
  onShow?: () => void
}

const LocalModal: React.FC<PropsI> = ({ onShow, children }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible
      presentationStyle="overFullScreen"
      onShow={onShow}
    >
      {children}
    </Modal>
  )
}

export default LocalModal
