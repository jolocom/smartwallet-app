import {
  Animated,
  ScrollViewProps,
  FlatListProps,
  FlatList,
} from 'react-native'
import { IWithCustomStyle } from '../Card/types'
import { ForwardRefExoticComponent, RefAttributes, ReactElement } from 'react'

interface IHeaderProps extends IWithCustomStyle {
  height?: number
}

interface IListProps {
  withoutHeaderPadding?: boolean
}

type IScrollViewProps = IWithCustomStyle & ScrollViewProps & IListProps

export type IFlatListProps = IWithCustomStyle &
  ForwardRefExoticComponent<FlatListProps<any>> &
  RefAttributes<Animated.AnimatedComponent<typeof FlatList>> &
  IListProps & {
    renderHidingText: () => ReactElement
  }

export interface ICollapsibleComposite {
  Header: React.FC<IHeaderProps>
  AnimatedHeader: React.FC<IHeaderProps>
  ScrollView: React.FC<IScrollViewProps>
  KeyboardAwareScrollView: React.FC<IScrollViewProps>
  FlatList: React.FC<IFlatListProps>
  HeaderText: React.FC
  HidingTextContainer: React.FC<IWithCustomStyle>
  HidingScale: React.FC
}

export interface ICollapsibleContext {
  setHeaderHeight: (height: number) => void
  setHidingTextHeight: (height: number) => void
  setDistanceToText: (distance: number) => void
  distanceToTop: number
  distanceToHeader: number
  headerHeight: number
  hidingTextHeight: number
  interpolateYValue: (inputRange: number[], outputRange: number[]) => void
  handleScroll: (...args: any[]) => void
}
