import { StyleSheet, Animated, Vibration, View, Text } from 'react-native'
import { DocumentCard } from '../../documents/components/documentCard'
import React, { useRef, useState } from 'react'
import { CredentialOffering } from '../../../lib/interactionManager/types'
import Interactable, { ISnapEvent } from 'react-native-interactable'
import { Colors, Typefaces } from '../../../styles'

const styles = StyleSheet.create({
  documentWrapper: {
    alignItems: 'center',
  },
})

interface Props {
  onPress: () => void
  selected: boolean
  offering: CredentialOffering
}
export const DocumentReceiveCard = (props: Props) => {
  const { selected, offering, onPress } = props
  const { type, renderInfo, valid } = offering

  const centerSnap = 0
  const leftSnap = -30
  const initScale = 0.8
  const finScale = 1
  const initMargin = -15
  const finMargin = 5

  const [scaleValue] = useState(new Animated.Value(initScale))
  const [translationX] = useState(new Animated.Value(leftSnap))
  const viewRef = useRef(null)

  const onPressCard = () => {
    // @ts-ignore
    viewRef.current.snapTo({ index: 0 })
    Animated.timing(scaleValue, {
      toValue: initScale,
      duration: 200,
    }).start(() => onPress())
  }

  const onSnap = (event: ISnapEvent) => {
    if (event.nativeEvent.index === 1) {
      Vibration.vibrate(10)
      Animated.timing(scaleValue, {
        toValue: finScale,
        duration: 100,
      }).start(onPress)
    }
  }

  const marginValue = scaleValue.interpolate({
    inputRange: [initScale, finScale],
    outputRange: [initMargin, finMargin],
  })

  const opacityValue = translationX.interpolate({
    inputRange: [-30, 20],
    outputRange: [1, 0],
  })

  console.log(type, selected)
  return (
    <View style={{ width: '100%' }}>
      <Animated.View
        style={[
          {
            width: '20%',
            height: '100%',
            position: 'absolute',
            right: 0,
            alignItems: 'center',
            justifyContent: 'center',
          },
          {
            opacity: selected ? 0 : opacityValue,
          },
        ]}
      >
        <Text
          style={{
            ...Typefaces.subtitle3,
            color: Colors.black,
            textAlign: 'center',
          }}
        >
          Pull to choose
        </Text>
      </Animated.View>
      <Interactable.View
        animatedValueX={translationX}
        ref={viewRef}
        horizontalOnly={true}
        snapPoints={[{ x: leftSnap }, { x: centerSnap }]}
        initialPosition={{ x: leftSnap }}
        onSnap={onSnap}
        dragEnabled={!selected}
        onTouchEnd={selected ? onPressCard : undefined}
        style={
          [
            styles.documentWrapper,
            {
              marginVertical: marginValue,
              transform: [{ scaleX: scaleValue }, { scaleY: scaleValue }],
            },
          ] as any
        }
      >
        <DocumentCard
          credentialType={type}
          renderInfo={renderInfo}
          invalid={!valid}
        />
      </Interactable.View>
    </View>
  )
}
