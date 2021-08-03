import React, { useState } from 'react'
import {
  LayoutChangeEvent,
  LayoutRectangle,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { getCardDimensions } from '../getCardDimenstions'
import { ScaledCardContext, useScaledCard } from './context'
import {
  IScaledCardProps,
  IScaledComponentProps,
  TSupportedComponentProps,
} from './types'

const scaleStyleObject = <T extends TSupportedComponentProps['style']>(
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

/*
 * The HOC is used to inject the newly scaled styles into components that accept
 * the `style` prop.
 */

const withScaledComponent =
  <T extends TSupportedComponentProps>(
    Component: React.ElementType<T>,
  ): React.FC<IScaledComponentProps<T>> =>
  ({ scaleStyle, style, children, ...props }) => {
    const { scaleBy } = useScaledCard()
    const scaledStyles = scaleStyleObject(scaleStyle as T['style'], scaleBy)

    return (
      // @ts-expect-error Typing the @Component as React.Element<any> removes the error,
      // but loses the type inheritance of T
      <Component style={[style, scaledStyles]} {...props}>
        {children}
      </Component>
    )
  }

export const ScaledView = withScaledComponent(View)
export const ScaledText = withScaledComponent(Text)

export default ScaledCard
