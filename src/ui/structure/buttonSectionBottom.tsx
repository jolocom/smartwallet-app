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
}

export const renderButtonSection: React.SFC<Props> = props => {
  const styles = StyleSheet.create({
    buttonBlock: {
      justifyContent: 'space-around',
      flexDirection: 'row',
      backgroundColor: JolocomTheme.primaryColorWhite
    },
    denyShareText: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.labelFontSize,
      color: JolocomTheme.primaryColorPurple,
      fontWeight: '100'
    },
    confirmButtonText: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.labelFontSize,
      color: props.disabled ? JolocomTheme.disabledButtonTextGrey : JolocomTheme.primaryColorSand,
      fontWeight: '100'
    },
    confirmButton: {
      backgroundColor: props.disabled ? JolocomTheme.disabledButtonBackGreny : JolocomTheme.primaryColorPurple
    }
  })

  const { flatten } = StyleSheet
  const { buttonBlock, denyShareText} = styles
  const { disabled, denyText, handleConfirm, handleDeny, confirmText } = props

  return (
    <Block style={flatten(buttonBlock)} flex={0.1}>
      <Button onPress={handleDeny} style={{ text: flatten(denyShareText) }} upperCase={false} text={denyText} />
      <Button
        disabled={disabled}
        onPress={handleConfirm}
        style={{
          container: flatten(styles.confirmButton),
          text: flatten(styles.confirmButtonText)
        }}
        upperCase={false}
        text={confirmText}
      />
    </Block>
  )
}
