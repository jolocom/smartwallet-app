import React from 'react'
import { Modal } from 'react-native'

interface PropsI {
  isVisible: boolean
  onShow?: () => void
}

const ModalScreen: React.FC<PropsI> = ({
  children,
  isVisible,
  onShow = () => {},
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      presentationStyle="overFullScreen"
      //@ts-ignore
      statusBarTranslucent={true}
      onShow={onShow}
    >
      {children}
    </Modal>
  )
}

export default ModalScreen
