import React from 'react'
import { Modal } from 'react-native'

interface PropsI {
  onShow?: () => void
  isVisible: boolean
}

const LocalModal: React.FC<PropsI> = ({ onShow, children, isVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      presentationStyle="overFullScreen"
      onShow={onShow}
    >
      {children}
    </Modal>
  )
}

export default LocalModal
