import React, { useRef, useState, useMemo } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  ScrollView,
} from 'react-native'

import Title from './Title'
import { ICollapsibleCloneComposite, TTitle } from './types'
import { compare } from './utils'
import { TITLE_HEIGHT, HEADER_HEIGHT } from './consts'
import Header from './Header'
import { CollapsibleCloneContext } from './context'

interface ICollapsibleClone {
  renderHeader: (
    currentTitle: string,
    scrollY: Animated.Value,
    /**
     * NOTE: it is important to calculate header height and set it
     * to correctly pad scroll view
     */
    setHeaderHeight: React.Dispatch<React.SetStateAction<number>>,
  ) => React.ReactElement | null
}

const CollapsibleClone: React.FC<ICollapsibleClone> &
  ICollapsibleCloneComposite = ({ renderHeader, children }) => {
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0)
  const [titles, setTitles] = useState<TTitle[]>([])
  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT)

  const currentTitleText = titles.length ? titles[currentTitleIdx].label : ''

  const ref = useRef<ScrollView>(null)
  const prevScrollPosition = useRef(0)
  const scrollY = useRef(new Animated.Value(0)).current

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset
        if (titles.length) {
          // if scrolling down
          if (y > prevScrollPosition.current) {
            if (currentTitleIdx !== titles.length - 1) {
              if (y >= titles[currentTitleIdx + 1].startY) {
                setCurrentTitleIdx((prev) => ++prev)
              }
            }
          } else {
            // if scrolling up
            if (currentTitleIdx !== 0) {
              if (y < titles[currentTitleIdx].startY) {
                setCurrentTitleIdx((prev) => --prev)
              }
            }
          }
          prevScrollPosition.current = y
        }
      },
    },
  )

  const handleSnap = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y
    if (titles.length) {
      const { startY, endY } = titles[currentTitleIdx]
      if (offsetY >= startY && offsetY <= endY) {
        if (ref.current) {
          ref.current.scrollTo({
            y: offsetY < startY + TITLE_HEIGHT / 2 ? startY : endY,
          })
        }
      }
    }
  }

  const handleAddTitle = (title: TTitle) => {
    setTitles((prev) => [...prev, title].sort(compare))
  }

  const contextValue = useMemo(
    () => ({
      currentTitleText,
      scrollY,
      onAddTitle: handleAddTitle,
      headerHeight,
    }),
    [currentTitleIdx],
  )

  return (
    <CollapsibleCloneContext.Provider value={contextValue}>
      {renderHeader(currentTitleText, scrollY, setHeaderHeight)}
      <Animated.ScrollView
        ref={ref}
        contentContainerStyle={{
          paddingTop: headerHeight,
        }}
        style={{ width: '100%' }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={handleSnap}
      >
        {children}
      </Animated.ScrollView>
    </CollapsibleCloneContext.Provider>
  )
}

CollapsibleClone.Title = Title
CollapsibleClone.Header = Header

export default CollapsibleClone
