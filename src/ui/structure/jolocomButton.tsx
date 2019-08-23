import React from 'react'
import { Button, ButtonProps } from 'react-native-material-ui'
import { StyleSheet } from 'react-native'
import { Buttons } from 'src/styles'

const styles = StyleSheet.create({
  container: {
    ...Buttons.buttonStandardContainer,
  },
  text: {
    ...Buttons.buttonStandardText,
  },
  disabledContainer: {
    ...Buttons.buttonDisabledStandardContainer,
  },
  disabledText: {
    ...Buttons.buttonDisabledStandardText,
  },
})

export const JolocomButton: React.FC<ButtonProps> = props => {
  return (
    <Button
      raised
      onPress={props.onPress}
      style={{
        container: props.disabled ? styles.disabledContainer : styles.container,
        text: props.disabled ? styles.disabledText : styles.text,
      }}
      upperCase={false}
      text={props.text}
      disabled={props.disabled}
    />
  )
}
