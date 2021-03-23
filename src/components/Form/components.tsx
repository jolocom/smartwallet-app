import React, { useEffect } from 'react'
import { LayoutAnimation, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText from '../JoloText'

interface FormError {
  message?: string
}

export const FormError: React.FC<FormError> = ({ message }) => {
  useEffect(() => {
    LayoutAnimation.configureNext({
      ...LayoutAnimation.Presets.easeInEaseOut,
      duration: 200,
    })
  }, [message])
  if (!message) return null
  return (
    <JoloText size={JoloTextSizes.mini} color={Colors.error}>
      {message}
    </JoloText>
  )
}

export const FormFieldContainer: React.FC = ({ children }) => {
  return <View style={{ marginBottom: 10 }} children={children} />
}
