import { TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native'

export interface IScaledCardContext {
  scaleStyleObject: <T extends ViewStyle | TextStyle>(style: T) => object
  scaleBy: number
}

export interface IScaledCardProps {
  originalWidth: number
  originalHeight: number
  scaleToFit?: boolean
  originalScreenWidth?: number
}

export interface IScaledViewProps extends ViewProps {
  scaleStyle: ViewStyle
}

export interface IScaledTextProps extends TextProps {
  scaleStyle: TextStyle
}
