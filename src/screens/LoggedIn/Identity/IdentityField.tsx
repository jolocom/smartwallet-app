import React from 'react'
import { View, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
  runOnJS,
  useAnimatedProps,
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
  value: string
  onDelete: () => void
}

const PADDING_DISTANCE = Dimensions.get('window').width * 0.05
const DELETE_BUTTON_WIDTH = 60

const IdentityField: React.FC<Props> = ({ type, id, value, onDelete }) => {
  const redirect = useRedirect()
  const x = useSharedValue(0)
  const isSelected = useSharedValue(false)

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; stopX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value
      ctx.stopX = DELETE_BUTTON_WIDTH
    },
    onActive: (event, ctx) => {
      console.log('start ', event.translationX)
      if (event.translationX < 0 && !isSelected.value) {
        x.value = ctx.startX + event.translationX
      } else if (event.translationX > 0 && isSelected.value) {
        x.value = ctx.startX + event.translationX
      }
    },
    onEnd: (event, ctx) => {
      console.log('end ', event.translationX)
      if (event.translationX < -ctx.stopX) {
        isSelected.value = true
        x.value = withSpring(-ctx.stopX)
      } else if (isSelected.value && event.translationX > -ctx.stopX) {
        x.value = withTiming(0, { duration: 100 })
        isSelected.value = false
      } else {
        x.value = withTiming(ctx.startX)
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
            console.log('prop ', isSelected.value)
            if (!isSelected.value) {
              redirect(ScreenNames.CredentialForm, {
                type,
                id,
              })
            }
          }}
          activeOpacity={1}
          key={id}
        >
          <Field.Static key={id} value={value} />
        </TouchableOpacity>
        <View
          style={{
            width: 400,
            height: '100%',
            paddingVertical: 2,
            top: 2,
            position: 'absolute',
            right: -PADDING_DISTANCE - 400,
          }}
        >
          <View
            style={{
              backgroundColor: 'red',
              flex: 1,
              borderRadius: 10,
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{
                height: '100%',
                width: DELETE_BUTTON_WIDTH,
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                isSelected.value = false
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

export default IdentityField
