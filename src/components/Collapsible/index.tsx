import React, { useRef, useState, useMemo, Children } from 'react'
import { Animated } from 'react-native'

import { CollapsibleContext } from './context'
import { Header, AnimatedHeader } from './components/CollapsibleHeader'
import { CollapsibleScrollView } from './components/ScrollView'
import { HidingScale } from './components/HidingScale'
import { HidingTextContainer } from './components/HidingTextContainer'
import { HeaderText } from './components/HeaderText'
import { ICollapsibleComposite } from './types'
import { CollapsibleFlatList } from './components/FlatList'

/***
 * NOTE:
 * A basic structure of a Collapsible screen would look like this:
 * <Collapsible>
 *    <Collapsible.Header>
 *      <Collapsible.HeaderText>{...}</Collapsible.HeaderText>
 *    </Collapsible.Header>
 *    <ScreenContainer>
 *      <Collapsible.ScrollView>
 *        <Collapsible.HidingTextContainer>
 *          {...}
 *        </Collapsible.HidingTextContainer>
 *        {...}
 *      </Collapsible.ScrollView>
 *    </ScreenContainer>
 * </Collapsible>
 ***/

const Collapsible: React.FC & ICollapsibleComposite = ({ children }) => {
  const yValue = useRef(new Animated.Value(0)).current
  const [distanceToText, setDistanceToText] = useState(50)
  const [headerHeight, setHeaderHeight] = useState(75)
  const [hidingTextHeight, setHidingTextHeight] = useState(80)

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

  // NOTE: must be added to any @Collapsible list component that accepts the @HidingTextContainer
  // as a child i.e. @Collapsible.ScrollView.
  const checkListHidingTextContainer = (listChildren: React.ReactNode) => {
    const isHidingTextContainer = Children.toArray(listChildren).some(
      (child) => {
        // @ts-ignore
        return child.type.displayName === HidingTextContainer.displayName
      },
    )

    if (!isHidingTextContainer) {
      throw new Error(
        `${HidingTextContainer.displayName} must be a direct child of a Collapsible scroll/list component`,
      )
    }
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
      checkListHidingTextContainer,
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
