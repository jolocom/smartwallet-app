import React from 'react'

import { StyleSheet, TouchableOpacity } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { IWithCustomStyle } from '~/types/props'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import { useToastToShow } from './context'

interface Props extends IWithCustomStyle {
  label?: string
}

const ToastDescription: React.FC<Props> = ({ label, customStyles = {} }) => {
  const { toastToShow, toastColor, invokeInteract } = useToastToShow()

  if (!toastToShow || !toastToShow.message) return null

  const ToastLabel = () => (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      color={toastColor}
      customStyles={[styles.customText, styles.customLabel]}
    >
      {label}
    </JoloText>
  )

  const ToastText = () => (
    <JoloText
      kind={JoloTextKind.subtitle}
      size={JoloTextSizes.tiniest}
      color={Colors.white}
      customStyles={[styles.customText, customStyles]}
    >
      {toastToShow.message} {label && <ToastLabel />}
    </JoloText>
  )

  return label ? (
    <TouchableOpacity onPress={invokeInteract} activeOpacity={0.6}>
      <ToastText />
    </TouchableOpacity>
  ) : (
    <ToastText />
  )
}

const styles = StyleSheet.create({
  customText: {
    textAlign: 'left',
    lineHeight: BP({ xsmall: 14, default: 18 }),
  },
  customLabel: {
    textDecorationLine: 'underline',
  },
})

export default ToastDescription
