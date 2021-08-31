import React from 'react'
import {
  Animated,
  ScrollView,
  ScrollViewProps,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ViewStyle,
  StyleProp,
  View,
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { NavHeaderType } from '../NavigationHeader'

export type TTitle = { label: string; startY: number; endY: number }

export interface ICollapsibleCloneContext {
  currentTitleText: string
  scrollY: Animated.Value
  onAddTitle: (title: TTitle) => void
  headerHeight: number
  scrollRef: React.RefObject<ScrollView>
  onScroll: ScrollViewProps['onScroll']
  onSnap: (
    e: NativeSyntheticEvent<NativeScrollEvent>,
    ref?: React.RefObject<ScrollView | FlatList>,
  ) => void
  currentTitle: TTitle | undefined
  collapsibleCloneRef: React.RefObject<View>
}

interface ITitle {
  text: string
  customContainerStyles?: StyleProp<ViewStyle>
}

interface IHeader {
  type?: NavHeaderType
}

interface IScroll extends ScrollViewProps {
  containerStyles?: StyleProp<ViewStyle>
}

export interface ICollapsibleCloneComposite {
  Title: React.FC<ITitle>
  Header: React.FC<IHeader>
  Scroll: React.FC<IScroll>
  KeyboardAwareScroll: React.FC<ScrollViewProps>
  Scale: React.FC
}

export function isFlatList(
  ref: React.RefObject<ScrollView | FlatList>,
): ref is React.RefObject<FlatList> {
  return ref.current instanceof FlatList
}

export function isKeyboardAwareScroll(
  ref: React.RefObject<ScrollView | FlatList | KeyboardAwareScrollView>,
): ref is React.RefObject<KeyboardAwareScrollView> {
  return ref.current instanceof KeyboardAwareScrollView
}

export function isScrollView(
  ref: React.RefObject<ScrollView | FlatList>,
): ref is React.RefObject<ScrollView> {
  return ref.current?.scrollTo !== undefined
}
