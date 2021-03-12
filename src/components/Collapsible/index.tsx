import React, { useRef, useState, useMemo } from 'react'
import { Animated } from 'react-native'

import { CollapsibleContext } from './context'
import { Header, AnimatedHeader } from './components/CollapsibleHeader'
import { CollapsibleScrollView } from './components/ScrollView'
import { HidingScale } from './components/HidingScale'
import { HidingTextContainer } from './components/HidingTextContainer'
import { HeaderText } from './components/HeaderText'
import { ICollapsibleComposite } from './types'
import { CollapsibleFlatList } from './components/FlatList'

const Collapsible: React.FC & ICollapsibleComposite = ({ children }) => {
  const yValue = useRef(new Animated.Value(0)).current
  const [distanceToText, setDistanceToText] = useState(0)
  const [headerHeight, setHeaderHeight] = useState(0)
  const [hidingTextHeight, setHidingTextHeight] = useState(0)

  const handleDistanceToText = (distance: number) => setDistanceToText(distance)
  const handleHeaderHeight = (height: number) => setHeaderHeight(height)
  const handleHidingTextHeight = (height: number) => setHidingTextHeight(height)

  const distanceToTop = distanceToText + hidingTextHeight
  const distanceToHeader = distanceToTop - headerHeight

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: yValue } },
      },
    ],
    { useNativeDriver: true },
  )

  const interpolateYValue = (inputRange: number[], outputRange: number[]) => {
    return yValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })
  }

  const context = useMemo(
    () => ({
      yValue,
      setDistanceToText: handleDistanceToText,
      setHeaderHeight: handleHeaderHeight,
      setHidingTextHeight: handleHidingTextHeight,
      distanceToTop,
      distanceToHeader,
      interpolateYValue,
      handleScroll,
    }),
    [distanceToText],
  )

  return <CollapsibleContext.Provider value={context} children={children} />
}

Collapsible.Header = Header
Collapsible.HeaderText = HeaderText
Collapsible.AnimatedHeader = AnimatedHeader
Collapsible.ScrollView = CollapsibleScrollView
Collapsible.FlatList = CollapsibleFlatList
Collapsible.HidingScale = HidingScale
Collapsible.HidingTextContainer = HidingTextContainer

export default Collapsible
