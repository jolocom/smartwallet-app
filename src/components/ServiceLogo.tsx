import React, { useEffect } from 'react'
import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
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

import { useToasts } from '~/hooks/toasts'
import { InitiatorPlaceholderIcon } from '~/assets/svg'
import { Colors } from '~/utils/colors'

interface Props {
  source?: string
  serviceUrl?: string
}

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
      {serviceUrl && (
        <View style={styles.gradientContainer}>
          <Animated.View style={rotationStyles}>
            <LinearGradient
              start={{ x: 1.0, y: 0.3 }}
              end={{ x: 1.0, y: 1.0 }}
              style={{
                width: 84,
                height: 84,
                borderRadius: 42,
                borderWidth: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              colors={[Colors.azureRadiance, Colors.white]}
            />
          </Animated.View>
        </View>
      )}
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
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  gradientContainer: {
    position: 'absolute',
    left: -7,
    top: -7,
  },
})
