import React from 'react'
import { Block } from '.'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-material-ui'
import { Colors, Buttons, Spacing } from 'src/styles'

interface Props {
  confirmText: string
  denyText: string
  handleConfirm: () => void
  handleDeny: () => void
  disabled: boolean
  denyDisabled?: boolean
  verticalPadding?: number
}

export const ButtonSection: React.FC<Props> = props => {
  const styles = StyleSheet.create({
    buttonBlock: {
      borderColor: Colors.lightGrey,
      borderTopWidth: 1,
      paddingVertical: props.verticalPadding ? props.verticalPadding : 'auto',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: Colors.white,
    },
    denyButtonText: {
      ...Buttons.buttonConsentTextBase,
      color: Colors.purpleMain,
    },
    confirmButtonText: {
      ...Buttons.buttonConsentTextBase,
      color: props.disabled ? Colors.blackMain050 : Colors.sandLight,
    },
    denyButton: {
      width: 'auto',
    },
    confirmButton: {
      paddingHorizontal: Spacing.LG,
      borderRadius: 4,
      backgroundColor: props.disabled ? Colors.lightGrey : Colors.purpleMain,
    },
  })

  const {
    disabled,
    denyDisabled,
    denyText,
    handleConfirm,
    handleDeny,
    confirmText,
  } = props

  return (
    <Block style={styles.buttonBlock} flex={0.1}>
      <Button
        disabled={denyDisabled}
        onPress={handleDeny}
        style={{
          container: styles.denyButton,
          text: styles.denyButtonText,
        }}
        upperCase={false}
        text={denyText}
      />
      <Button
        disabled={disabled}
        onPress={handleConfirm}
        style={{
          container: styles.confirmButton,
          text: styles.confirmButtonText,
        }}
        upperCase={false}
        text={confirmText}
      />
    </Block>
  )
}
