import { Animated, ScrollViewProps } from 'react-native'
import { IWithCustomStyle } from '../Card/types'

interface IHeaderProps extends IWithCustomStyle {
  height?: number
}

interface IScrollViewProps extends IWithCustomStyle, ScrollViewProps {
  animatedHeader?: boolean
}

export interface ICollapsibleComposite {
  Header: React.FC<IHeaderProps>
  AnimatedHeader: React.FC<IHeaderProps>
  ScrollView: React.FC<IScrollViewProps>
  HeaderText: React.FC
  HidingTextContainer: React.FC
  HidingScale: React.FC
}

export interface ICollapsibleContext {
  yValue: Animated.AnimatedValue
  distanceToText: number
  setDistanceToText: (distance: number) => void
  interpolateYValue: (inputRange: number[], outputRange: number[]) => void
  handleScroll: (...args: any[]) => void
}
