import React, {useEffect, useRef} from 'react'
import { StyleSheet, View, Text, Animated } from 'react-native'
import { Container } from 'src/ui/structure/'
import { MaskedImageComponent } from 'src/ui/registration/components/maskedImage'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { Typography, Colors } from 'src/styles'
import { HandIcon, SplashIcon } from 'src/resources/index'

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

const usePulse = (pulseTiming: (val: Animated.Value) => Animated.CompositeAnimation) => {
  const pulseValue = useRef(new Animated.Value(0)).current

  const pulse = () => pulseTiming(pulseValue).start(pulse)

  useEffect(() => {
    const timeout = setTimeout(pulse, 0)
    return () => clearTimeout(timeout)
  })

  return pulseValue
}

const handTiming = (val: Animated.Value) =>
  Animated.sequence([
    Animated.timing(val, { toValue: 1 }),
    Animated.timing(val, { toValue: 0 })
  ])

const splashTiming = (val: Animated.Value) =>
  Animated.sequence([
    Animated.timing(val, {toValue: 1}),
    Animated.timing(val, {toValue: 0})
  ])

export const EntropyComponent: React.SFC<Props> = props => {
  const { progress, addPoint } = props
  
  const handOpacity = usePulse(handTiming)
  const splashOpacity = usePulse(splashTiming)

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
          ? <View>
              <Animated.View style={{ splashOpacity }}>
                <SplashIcon />
              </Animated.View>
              <Animated.View style={{ handOpacity }}>
                <HandIcon />
              </Animated.View>
            </View>
          : <MaskedImageComponent disabled={progress === 1} addPoint={addPoint} />
        }
      </View>
    </Container>
  )
}
