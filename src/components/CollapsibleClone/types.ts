import React from "react";
import {Animated, ScrollView, ScrollViewProps, FlatList, NativeSyntheticEvent, NativeScrollEvent} from "react-native";

export type TTitle = {label: string, startY: number, endY: number}

export interface ICollapsibleCloneContext {
  currentTitleText: string,
  scrollY: Animated.Value,
  onAddTitle: (title: TTitle) => void,
  headerHeight: number,
  scrollRef: React.RefObject<ScrollView>, 
  onScroll: ScrollViewProps['onScroll'],
  onSnap: (e: NativeSyntheticEvent<NativeScrollEvent>, ref?: React.RefObject<ScrollView | FlatList>) => void
}

interface ITitle {
  text: string
}

export interface ICollapsibleCloneComposite {
  Title: React.FC<ITitle>
  Header: React.FC
  Scroll: React.FC
}

export function isFlatList(ref: React.RefObject<ScrollView | FlatList>): ref is React.RefObject<FlatList> {
  return ref.current instanceof FlatList;
}

export function isScrollView(ref: React.RefObject<ScrollView | FlatList>): ref is React.RefObject<ScrollView> {
  return ref.current?.scrollTo !== undefined
}
