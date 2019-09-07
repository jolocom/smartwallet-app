import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { Container } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors } from 'src/styles'
import { HandAnimationComponent } from './handAnimation'

interface Props {
  addPoint: (x: number, y: number) => void
  readonly progress: number
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors.blackMain,
  },
  text: {
    ...Typography.subMainText,
    textAlign: 'center',
    color: Colors.sandLight,
    position: 'absolute',
    top: '20%',
    paddingHorizontal: '5%',
  },
  bigFont: {
    fontSize: Typography.text4XL,
  },
  contentView: {
    width: '100%',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  }
})

export const EntropyComponent: React.SFC<Props> = props => {
  const { progress, addPoint } = props
  
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
      <View style={styles.contentView}>
        {
          progress === 0
          ? <View style={{position: 'absolute'}}><HandAnimationComponent /></View>
          : null
        }
        <MaskedImageComponent disabled={progress === 1} addPoint={addPoint} />      
      </View>
    </Container>
  )
}
