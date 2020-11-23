import React from 'react'
import { Modal } from 'react-native'

interface PropsI {
  isVisible: boolean
  onShow?: () => void
  animationType?: 'none' | 'slide' | 'fade'
}

const ModalScreen: React.FC<PropsI> = ({
  children,
  isVisible,
  animationType = 'fade',
  onShow = () => {},
}) => {
  return (
    <Modal
      animationType={animationType}
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
