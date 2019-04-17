import React from 'react'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { Block } from '.'
import { StyleSheet } from 'react-native'
import { Button } from 'react-native-material-ui'

interface Props {
  confirmText: string
  denyText: string
  handleConfirm: () => void
  handleDeny: () => void
  disabled: boolean
  resetDeny?: boolean
  verticalPadding?: number
}

export const ButtonSection: React.SFC<Props> = props => {
  const styles = StyleSheet.create({
    buttonBlock: {
      paddingVertical: props.verticalPadding ? props.verticalPadding : 'auto',
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: JolocomTheme.primaryColorWhite,
    },
    denyButtonText: {
      paddingVertical: 10,
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.labelFontSize,
      color: JolocomTheme.primaryColorPurple,
      fontWeight: '100',
    },
    confirmButtonText: {
      paddingVertical: 10,
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.labelFontSize,
      color: props.disabled
        ? JolocomTheme.disabledButtonTextGrey
        : JolocomTheme.primaryColorSand,
      fontWeight: '100',
    },
    denyButton: {
      width: props.resetDeny ? 'auto' : '40%',
    },
    confirmButton: {
      paddingHorizontal: 25,
      borderRadius: 4,
      backgroundColor: props.disabled
        ? JolocomTheme.disabledButtonBackgroundGrey
        : JolocomTheme.primaryColorPurple,
    },
  })

  const { flatten } = StyleSheet
  const {
    buttonBlock,
    confirmButton,
    denyButton,
    denyButtonText,
    confirmButtonText,
  } = styles
  const { disabled, denyText, handleConfirm, handleDeny, confirmText } = props

  return (
    <Block style={flatten(buttonBlock)} flex={0.1}>
      <Button
        onPress={handleDeny}
        style={{
          container: flatten(denyButton),
          text: flatten(denyButtonText),
        }}
        upperCase={false}
        text={denyText}
      />
      <Button
        disabled={disabled}
        onPress={handleConfirm}
        style={{
          container: flatten(confirmButton),
          text: flatten(confirmButtonText),
        }}
        upperCase={false}
        text={confirmText}
      />
    </Block>
  )
}
