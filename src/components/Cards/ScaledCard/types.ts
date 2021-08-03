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

export type TSupportedComponentProps = ViewProps | TextProps

export type IScaledComponentProps<T extends TSupportedComponentProps> = {
  scaleStyle: StyleProp<T['style']>
} & T
