import React from 'react'
import { Modal } from 'react-native'

interface PropsI {
  isVisible: boolean
}

const ModalScreen: React.FC<PropsI> = ({ children, isVisible }) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      presentationStyle="overFullScreen"
      //@ts-ignore
      statusBarTranslucent={true}
    >
      {children}
    </Modal>
  )
}

export default ModalScreen
