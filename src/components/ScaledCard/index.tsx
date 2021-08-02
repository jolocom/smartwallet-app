import React, { useState } from 'react'
import {
  Dimensions,
  LayoutChangeEvent,
  LayoutRectangle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { ScaledCardContext, useScaledCard } from './context'
import {
  IScaledCardContext,
  IScaledCardProps,
  IScaledTextProps,
  IScaledViewProps,
} from './types'

const ScaledCard: React.FC<IScaledCardProps> = ({
  originalHeight,
  originalWidth,
  scaleToFit = false,
  originalScreenWidth,
  children,
}) => {
  const [containerDimensions, setContainerDimensions] =
    useState<Pick<LayoutRectangle, 'width' | 'height'>>()

  const handleLayout = (e: LayoutChangeEvent) => {
    setContainerDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    })
  }

  let scaleBy = 1,
    scaledHeight: number,
    scaledWidth: number

  if (scaleToFit && originalScreenWidth) {
    console.warn(
      'ScaledCard component received both "scaleToFit" and "originalScreenWidth" props. Falling back to "scaleToFit".',
    )
  } else if (!scaleToFit && !originalScreenWidth) {
    console.warn(
      'ScaledCard component received neither "scaleToFit" nor "originalScreenWidth" props. Falling back to "scaleToFit".',
    )
  }

  if (originalScreenWidth) {
    scaleBy = Dimensions.get('screen').width / originalScreenWidth

    if (scaleBy < 1) {
      scaledWidth = originalWidth * scaleBy
      scaledHeight = originalHeight * scaleBy
    }
  } else if (scaleToFit && containerDimensions) {
    scaleBy = containerDimensions.width / originalWidth

    if (scaleBy < 1) {
      scaledWidth = containerDimensions.width
      scaledHeight = originalHeight * scaleBy
    }
  } else {
    scaledWidth = originalWidth
    scaledHeight = originalHeight
  }

  if (scaleBy > 1) {
    scaledWidth = originalWidth
    scaledHeight = originalHeight
  }

  const scaleStyleObject: IScaledCardContext['scaleStyleObject'] = (style) =>
    Object.entries(style ?? {}).reduce<ViewStyle | TextStyle>(
      (acc, [key, value]) => ({
        ...acc,
        [key]: Number.isInteger(value) ? value * scaleBy : value,
      }),
      {},
    )

  return (
    <ScaledCardContext.Provider value={{ scaleBy, scaleStyleObject }}>
      <View
        style={{ width: scaledWidth!, height: scaledHeight! }}
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
  const { scaleStyleObject } = useScaledCard()
  const scaledStyles = scaleStyleObject(scaleStyle)

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
  const { scaleStyleObject } = useScaledCard()
  const scaledStyles = scaleStyleObject(scaleStyle)

  return (
    <Text {...props} style={[style, scaledStyles]}>
      {children}
    </Text>
  )
}
export default ScaledCard
