import React, { useRef, useState, useMemo } from 'react'
import { Animated } from 'react-native'

import { CollapsibleContext } from './context'
import { Header, AnimatedHeader } from './components/CollapsibleHeader'
import { CollapsibleScrollView } from './components/ScrollView'
import { HidingScale } from './components/HidingScale'
import { HidingTextContainer } from './components/HidingTextContainer'
import { HeaderText } from './components/HeaderText'
import { ICollapsibleComposite } from './types'

const Collapsible: React.FC & ICollapsibleComposite = ({ children }) => {
  const yValue = useRef(new Animated.Value(0)).current
  const [distanceToText, setDistanceToText] = useState(0)

  const handleDistanceToText = (distance: number) => setDistanceToText(distance)

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
      distanceToText,
      setDistanceToText: handleDistanceToText,
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
Collapsible.HidingScale = HidingScale
Collapsible.HidingTextContainer = HidingTextContainer

export default Collapsible
