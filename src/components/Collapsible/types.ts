import { Animated } from 'react-native'
import { IWithCustomStyle } from '../Card/types'

export interface ICollapsibleComposite {
  Header: React.FC<IWithCustomStyle>
  AnimatedHeader: React.FC<IWithCustomStyle>
  ScrollView: React.FC<IWithCustomStyle>
  HeaderText: React.FC
  HidingScale: React.FC
}

export interface ICollapsibleContext {
  yValue: Animated.AnimatedValue
  distanceToText: number
  setDistanceToText: (distance: number) => void
  interpolateYValue: (inputRange: number[], outputRange: number[]) => void
  handleScroll: (...args: any[]) => void
}
