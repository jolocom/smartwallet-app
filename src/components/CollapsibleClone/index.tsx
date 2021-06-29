import React, { useRef, useState, useMemo, useCallback } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  ScrollView,
  FlatList,
} from 'react-native'

import Title from './Title'
import {
  ICollapsibleCloneComposite,
  ICollapsibleCloneContext,
  isFlatList,
  isScrollView,
  TTitle,
} from './types'
import { compare } from './utils'
import { TITLE_HEIGHT, HEADER_HEIGHT } from './consts'
import Header from './Header'
import { CollapsibleCloneContext } from './context'
import Scroll from './Scroll'

interface ICollapsibleClone {
  renderHeader: (
    currentTitle: string,
    scrollY: Animated.Value,
    /**
     * NOTE: it is important to calculate header height and set it
     * to correctly pad scroll view
     */
    setHeaderHeight: React.Dispatch<React.SetStateAction<number>>,
    headerHeight: number,
  ) => React.ReactElement | null
  renderScroll: (context: ICollapsibleCloneContext) => React.ReactElement | null
}

const CollapsibleClone: React.FC<ICollapsibleClone> &
  ICollapsibleCloneComposite = ({ renderHeader, renderScroll, children }) => {
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
        if (y !== prevScrollPosition.current) {
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
        }
      },
    },
  )

  const handleSnap = <T extends ScrollView | FlatList>(
    event: NativeSyntheticEvent<NativeScrollEvent>,
    passedRef?: React.RefObject<T>,
  ) => {
    const list = passedRef ?? ref
    const offsetY = event.nativeEvent.contentOffset.y
    if (titles.length) {
      const { startY, endY } = titles[currentTitleIdx]
      if (offsetY >= startY && offsetY <= endY) {
        if (list.current) {
          const moveToY = offsetY < startY + TITLE_HEIGHT / 2 ? startY : endY
          if (isFlatList(list)) {
            list.current.scrollToOffset({
              offset: moveToY,
            })
          } else if (isScrollView(list)) {
            list.current.scrollTo({
              y: moveToY,
            })
          }
        }
      }
    }
  }

  const handleAddTitle = useCallback((title: TTitle) => {
    setTitles((prev) => [...prev, title].sort(compare))
  }, [])

  const contextValue = useMemo(
    () => ({
      currentTitleText, // for Header
      scrollY, // for Title
      headerHeight, // for Title, Scroll
      onAddTitle: handleAddTitle, // for Title
      scrollRef: ref, // for Scroll,
      onScroll: handleScroll, // for Scroll,
      onSnap: handleSnap, // for Scroll,
    }),
    [currentTitleText, headerHeight],
  )

  return (
    <CollapsibleCloneContext.Provider value={contextValue}>
      {renderHeader(currentTitleText, scrollY, setHeaderHeight, headerHeight)}
      {renderScroll(contextValue)}
      {children}
    </CollapsibleCloneContext.Provider>
  )
}

CollapsibleClone.Title = Title
CollapsibleClone.Header = Header
CollapsibleClone.Scroll = Scroll

export default CollapsibleClone
