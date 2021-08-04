import {
  LayoutChangeEvent,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native'
import { TSupportedComponentProps } from './types'

/**
 * @internal
 */
export const scaleStyleObject = <T extends TSupportedComponentProps['style']>(
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

/**
 * @internal
 */
export const handleContainerLayout = (e: LayoutChangeEvent) => {
  const { width, height } = e.nativeEvent.layout
  return {
    width,
    height,
  }
}
