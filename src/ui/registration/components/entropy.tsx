import React, {useEffect, useRef} from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { Container, JolocomButton } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors } from 'src/styles'

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
})

const usePulse = () => {
  const opacity = useRef(new Animated.Value(0)).current
  
  const pulse = () => Animated.sequence([
    Animated.timing(opacity, { toValue: 1 }),
    Animated.timing(opacity, { toValue: 0 })
  ]).start(pulse)

  useEffect(() => {
    const timeout = setTimeout(pulse, 0)
    return () => clearTimeout(timeout)
  })

  return opacity
}

export const EntropyComponent: React.SFC<Props> = props => {
  const { progress, addPoint } = props
  const opacity = usePulse()

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
      <View style={{ width: '100%' }}>
        {
          progress === 0
          ? <Animated.Image style={{ opacity }} source={require('src/resources/img/hand.svg')} />
          : <MaskedImageComponent disabled={progress === 1} addPoint={addPoint} />
        }
      </View>
    </Container>
  )
}
