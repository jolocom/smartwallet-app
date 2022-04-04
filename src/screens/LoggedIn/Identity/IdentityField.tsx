import React from 'react'
import { View, Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { AttributeTypes } from '~/types/credentials'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import Field from '~/components/Widget/Field'
import { CloseIcon } from '~/assets/svg'

interface Props {
  type: AttributeTypes
  id: string
  value: string | string[]
  onDelete: () => void
}

const DELETE_BUTTON_WRAPPER = 400
const DELETE_BUTTON_POSITION =
  Dimensions.get('window').width * -0.05 - DELETE_BUTTON_WRAPPER
const DELETE_BUTTON_WIDTH = 60

const IdentityField: React.FC<Props> = ({ type, id, value, onDelete }) => {
  const redirect = useRedirect()
  const x = useSharedValue(0)
  const selected = useSharedValue(false)

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; selectThreshold: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value
      ctx.selectThreshold = DELETE_BUTTON_WIDTH
    },
    onActive: (event, ctx) => {
      const shouldSelect = event.translationX < -ctx.selectThreshold
      const shouldUnselect = event.translationX > -ctx.selectThreshold

      if (shouldSelect) {
        if (!selected.value) {
          selected.value = true
          x.value = withSpring(-ctx.selectThreshold, {
            damping: 8,
            velocity: 30,
          })
        } 
      } else if (shouldUnselect) {
        x.value = withTiming(0)
        selected.value = false
      } else {
        x.value = ctx.startX + event.translationX
      }
    },
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }))

  return (
    <PanGestureHandler onGestureEvent={gestureHandler} minDeltaX={2}>
      <Animated.View style={[animatedStyle]}>
        <TouchableOpacity
          onPress={() => {
            {
              if (!selected.value) {
                redirect(ScreenNames.CredentialForm, {
                  type,
                  id,
                })
              }
            }
          }}
          activeOpacity={1}
          key={id}
        >
          <Field.Static key={id} value={value} />
        </TouchableOpacity>
        <View style={styles.swipeContainer}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.button}
              onPress={() => {
                //selected.value = false
                x.value = withTiming(400, { duration: 100 }, () => {
                  runOnJS(onDelete)()
                })
              }}
            >
              {/* TODO: Replace with real icon */}
              <CloseIcon />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}

const styles = StyleSheet.create({
  swipeContainer: {
    width: DELETE_BUTTON_WRAPPER,
    height: '100%',
    paddingVertical: 3,
    top: 0,
    position: 'absolute',
    right: DELETE_BUTTON_POSITION,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'red',
    borderRadius: 8,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  button: {
    height: '100%',
    width: DELETE_BUTTON_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default IdentityField
