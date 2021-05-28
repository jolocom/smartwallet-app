import React from 'react'
import { Modal, ModalProps } from 'react-native'

interface PropsI extends ModalProps {
  isVisible: boolean
  onShow?: () => void
  animationType?: 'none' | 'slide' | 'fade'
}

const ModalScreen: React.FC<PropsI> = ({
  children,
  isVisible,
  animationType = 'fade',
  onShow = () => {},
  ...props
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
      {...props}
    >
      {children}
    </Modal>
  )
}

export default ModalScreen
