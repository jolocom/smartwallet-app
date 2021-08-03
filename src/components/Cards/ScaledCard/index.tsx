import React, { useState } from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { getCardDimensions } from '../getCardDimenstions'
import { ScaledCardContext, useScaledCard } from './context'
import { IScaledCardProps, IScaledTextProps, IScaledViewProps } from './types'

const scaleStyleObject = <
  T extends StyleProp<ViewStyle> | StyleProp<TextStyle>,
>(
  style: T,
  scaleBy: number,
) => {
  style = StyleSheet.flatten(style) as T

  return Object.entries(style ?? {}).reduce<ViewStyle | TextStyle>(
    (acc, [key, value]) => ({
      ...acc,
      [key]: Number.isInteger(value) ? value * scaleBy : value,
    }),
    {},
  )
}

const ScaledCard: React.FC<IScaledCardProps> = ({
  originalHeight,
  originalWidth,
  scaleToFit = false,
  originalScreenWidth,
  style: viewStyle,
  children,
  ...viewProps
}) => {
  const [containerDimensions, setContainerDimensions] =
    useState<Pick<LayoutRectangle, 'width' | 'height'>>()

  const isContainerLayoutReady = scaleToFit && !containerDimensions

  const { scaleBy, scaledHeight, scaledWidth } = getCardDimensions(
    originalWidth,
    originalHeight,
    {
      ...(scaleToFit
        ? { containerWidth: containerDimensions?.width }
        : { originalScreenWidth }),
    },
  )

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  return (
    <ScaledCardContext.Provider value={{ scaleBy }}>
      <View
        {...viewProps}
        style={[
          viewStyle,
          isContainerLayoutReady
            ? { width: 'auto', height: 'auto' }
            : { width: scaledWidth, height: scaledHeight },
        ]}
        onLayout={handleLayout}
      >
        {children}
      </View>
    </ScaledCardContext.Provider>
  )
}

export const ScaledView: React.FC<IScaledViewProps> = ({
  scaleStyle,
  style,
  children,
  ...props
}) => {
  const { scaleBy } = useScaledCard()
  const scaledStyles = scaleStyleObject(scaleStyle, scaleBy)

  return (
    <View {...props} style={[style, scaledStyles]}>
      {children}
    </View>
  )
}

export const ScaledText: React.FC<IScaledTextProps> = ({
  scaleStyle,
  style,
  children,
  ...props
}) => {
  const { scaleBy } = useScaledCard()
  const scaledStyles = scaleStyleObject(scaleStyle, scaleBy)

  return (
    <Text {...props} style={[style, scaledStyles]}>
      {children}
    </Text>
  )
}
export default ScaledCard
