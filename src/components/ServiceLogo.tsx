import React, { useEffect } from 'react'
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated'

import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { useToasts } from '~/hooks/toasts'
import { Colors } from '~/utils/colors'

interface Props {
  source?: string
  serviceUrl?: string
}

const IMAGE_SIZE = 70
const GRADIENT_SIZE = 74

export const ServiceLogo: React.FC<Props> = ({ source, serviceUrl }) => {
  const { scheduleErrorWarning } = useToasts()

  const rotationValue = useSharedValue('0deg')
  const startAnimation = () => {
    rotationValue.value = withRepeat(
      withTiming('360deg', {
        duration: 750,
        easing: Easing.linear,
      }),
      -1,
    )
  }

  useEffect(() => {
    startAnimation()

    return () => {
      cancelAnimation(rotationValue)
    }
  }, [])

  const handleRedirectToCounterparty = async () => {
    if (serviceUrl) {
      try {
        await Linking.openURL(serviceUrl)
      } catch (e) {
        scheduleErrorWarning(e as Error)
      }
    }
  }

  const rotationStyles = useAnimatedStyle(() => ({
    transform: [{ rotate: rotationValue.value.toString() }],
  }))

  return source ? (
    <View>
      {serviceUrl ? (
        <View style={styles.gradientContainer}>
          <Animated.View style={rotationStyles}>
            <LinearGradient
              start={{ x: 1.0, y: 0.3 }}
              end={{ x: 1.0, y: 1.0 }}
              style={{
                width: GRADIENT_SIZE,
                height: GRADIENT_SIZE,
                borderRadius: GRADIENT_SIZE / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={[Colors.azureRadiance, Colors.white]}
            />
          </Animated.View>
        </View>
      ) : null}
      <TouchableOpacity
        onPress={serviceUrl && handleRedirectToCounterparty}
        activeOpacity={serviceUrl ? 0.9 : 1}
      >
        <Image style={styles.image} source={{ uri: source }} />
      </TouchableOpacity>
    </View>
  ) : (
    <View style={[styles.image, { backgroundColor: Colors.white }]}>
      <InitiatorPlaceholderIcon />
    </View>
  )
}

const styles = StyleSheet.create({
  image: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: IMAGE_SIZE / 2,
  },
  gradientContainer: {
    position: 'absolute',
    left: -(GRADIENT_SIZE - IMAGE_SIZE) / 2,
    top: -(GRADIENT_SIZE - IMAGE_SIZE) / 2,
  },
})
