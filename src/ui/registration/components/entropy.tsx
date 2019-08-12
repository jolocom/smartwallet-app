import React from 'react'
import { Button } from 'react-native-material-ui'
import { StyleSheet, View, Dimensions, Text } from 'react-native'
import { Block, Container } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors, Buttons } from 'src/styles'

interface Props {
  addPoint: (x: number, y: number) => void
  submitEntropy: () => void
  readonly progress: number
}

const viewWidth: number = Dimensions.get('window').width

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blackMain,
  },
  footerButton: {
    position: 'absolute',
    bottom: '5%',
  },
  text: {
    ...Typography.subMainText,
    textAlign: 'center',
    color: Colors.sandLight,
    position: 'absolute',
    top: '20%',
    paddingHorizontal: viewWidth / 15,
  },
  bigFont: {
    fontSize: Typography.text4XL,
  },
  buttonContainer: {
    ...Buttons.buttonStandardContainer,
  },
  buttonText: {
    ...Buttons.buttonStandardText,
  },
})

export const EntropyComponent: React.SFC<Props> = props => {
  const { progress, submitEntropy, addPoint } = props

  const msg =
    progress === 0
      ? I18n.t(strings.FOR_SECURITY_PURPOSES_WE_NEED_SOME_RANDOMNESS) +
        '. ' +
        I18n.t(strings.PLEASE_TAP_THE_SCREEN_AND_DRAW_ON_IT_RANDOMLY)
      : `${Math.trunc(progress * 100)} %`

  const textStyle = progress === 0 ? styles.text : [styles.text, styles.bigFont]

  return (
    <Container style={styles.mainContainer}>
      <Text style={textStyle}>{msg}</Text>
      <Block>
        <MaskedImageComponent disabled={progress === 1} addPoint={addPoint} />
      </Block>
      <View style={styles.footerButton}>
        {progress === 1 ? (
          <Button
            style={{
              container: styles.buttonContainer,
              text: styles.buttonText,
            }}
            upperCase={false}
            raised={true}
            text={I18n.t(strings.CONTINUE)}
            onPress={submitEntropy}
          />
        ) : null}
      </View>
    </Container>
  )
}
