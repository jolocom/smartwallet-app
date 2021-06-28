import React from "react";
import {Animated} from "react-native";

export type TTitle = {label: string, startY: number, endY: number}

export interface ICollapsibleCloneContext {
  currentTitleText: string,
  scrollY: Animated.Value,
  onAddTitle: (title: TTitle) => void
}

interface ITitle {
  text: string
}

export interface ICollapsibleCloneComposite {
  Title: React.FC<ITitle>
  Header: React.FC
}