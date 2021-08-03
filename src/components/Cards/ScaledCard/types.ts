import {
  TextProps,
  TextStyle,
  ViewProps,
  ViewStyle,
  StyleProp,
} from 'react-native'

export interface IScaledCardContext {
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
  scaleStyle: StyleProp<ViewStyle>
}

export interface IScaledTextProps extends TextProps {
  scaleStyle: StyleProp<TextStyle>
}
