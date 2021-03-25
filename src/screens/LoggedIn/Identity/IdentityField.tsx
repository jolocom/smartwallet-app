import React from 'react'
import { View, Dimensions } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  PanGestureHandlerGestureEvent,
  PanGestureHandler,
} from 'react-native-gesture-handler'

import { AttributeTypes } from '~/types/credentials'
import { useRedirect } from '~/hooks/navigation'
import { ScreenNames } from '~/types/screens'
import Field from '~/components/Widget/Field'

interface Props {
  type: AttributeTypes
  id: string
  value: string
}

const PADDING_DISTANCE = Dimensions.get('window').width * 0.05
const DELETE_BUTTON_WIDTH = 50

const IdentityField: React.FC<Props> = ({ type, id, value }) => {
  const redirect = useRedirect()
  const x = useSharedValue(0)
  const isSelected = useSharedValue(false)

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { startX: number; stopX: number }
  >({
    onStart: (_, ctx) => {
      ctx.startX = x.value
      ctx.stopX = DELETE_BUTTON_WIDTH + PADDING_DISTANCE
    },
    onActive: (event, ctx) => {
      if (event.translationX < 0 && !isSelected.value) {
        x.value = ctx.startX + event.translationX
      }
    },
    onEnd: (event, ctx) => {
      if (event.translationX < -ctx.stopX) {
        isSelected.value = true
        x.value = withSpring(-ctx.stopX)
      } else if (!isSelected.value) {
        x.value = withSpring(ctx.startX)
      } else if (isSelected.value && event.translationX > 0) {
        x.value = withSpring(ctx.startX)
        isSelected.value = false
      }
    },
  })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }],
  }))

  return (
    <PanGestureHandler onGestureEvent={gestureHandler}>
      <Animated.View
        style={[animatedStyle]}
        onTouchStart={() => {
          if (isSelected.value) {
            x.value = withSpring(0, {}, () => {
              isSelected.value = false
            })
          }
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            if (!isSelected.value) {
              redirect(ScreenNames.CredentialForm, {
                type,
                id,
              })
            }
          }}
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
              }}
              onPress={() => {
                isSelected.value = false
                x.value = withTiming(400)
              }}
            />
          </View>
        </View>
      </Animated.View>
    </PanGestureHandler>
  )
}

export default IdentityField
