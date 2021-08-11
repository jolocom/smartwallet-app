import React, { useState } from 'react'
import { LayoutChangeEvent, LayoutRectangle, Text, View } from 'react-native'
import { getCardDimensions } from '../getCardDimenstions'
import { ScaledCardContext, useScaledCard } from './context'
import {
  IScaledCardProps,
  IScaledComponentProps,
  TSupportedComponentProps,
} from './types'
import { handleContainerLayout, scaleStyleObject } from './utils'

const ScaledCard: React.FC<IScaledCardProps> = ({
  originalHeight,
  originalWidth,
  scaleToFit = false,
  originalScreenWidth,
  style: viewStyle = {},
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
        ? { containerWidth: containerDimensions?.width! }
        : { originalScreenWidth: originalScreenWidth! }),
    },
  )

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = handleContainerLayout(e)
    setContainerDimensions({
      height,
      width,
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
        testID="scaled-container"
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
  ({ scaleStyle, style = {}, children, ...props }) => {
    const { scaleBy } = useScaledCard()
    const scaledStyles = scaleStyleObject(scaleStyle as T['style'], scaleBy)
    return (
      // @ts-expect-error Typing the @Component as React.Element<any> removes the error,
      // but loses the type inheritance of T
      <Component
        style={[style, scaledStyles]}
        {...props}
        testID={`scaled-${Component.displayName}`}
      >
        {children}
      </Component>
    )
  }

export const ScaledView = withScaledComponent(View)
export const ScaledText = withScaledComponent(Text)

export default ScaledCard
