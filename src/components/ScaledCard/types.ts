import { TextProps, TextStyle, ViewProps, ViewStyle } from 'react-native'

export interface IScaledCardContext {
  scaleStyleObject: <T extends ViewStyle | TextStyle>(style: T) => object
  scaleBy: number
}

interface IScaleToFitProp {
  scaleToFit: boolean
  originalScreenWidth?: never
}

interface IOriginalScreenWidthProp {
  scaleToFit?: never
  originalScreenWidth: number
}

export type IScaledCardProps = {
  originalWidth: number
  originalHeight: number
} & (IScaleToFitProp | IOriginalScreenWidthProp) &
  ViewProps

export interface IScaledViewProps extends ViewProps {
  scaleStyle: ViewStyle
}

export interface IScaledTextProps extends TextProps {
  scaleStyle: TextStyle
}
