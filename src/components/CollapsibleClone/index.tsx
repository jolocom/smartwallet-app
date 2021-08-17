import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Animated,
  ScrollView,
  FlatList,
  View,
  LayoutChangeEvent,
} from 'react-native'

import Title from './Title'
import {
  ICollapsibleCloneComposite,
  ICollapsibleCloneContext,
  isFlatList,
  isKeyboardAwareScroll,
  isScrollView,
  TTitle,
} from './types'
import { compare } from './utils'
import { TITLE_HEIGHT } from './consts'
import Header from './Header'
import { CollapsibleCloneContext } from './context'
import Scroll from './Scroll'
import Scale from './Scale'
import KeyboardAwareScrollView from './KeyboardAwareScroll'
import { Colors } from '~/utils/colors'

interface ICollapsibleClone {
  renderHeader: (
    currentTitle: string,
    scrollY: Animated.Value,
    /**
     * NOTE: it is important to calculate header height and set it
     * to correctly pad scroll view
     */
    headerHeight: number,
  ) => React.ReactElement | null
  renderScroll: (context: ICollapsibleCloneContext) => React.ReactElement | null
}

const CollapsibleClone: React.FC<ICollapsibleClone> &
  ICollapsibleCloneComposite = ({ renderHeader, renderScroll, children }) => {
  /**
   * A support of multiple titles
   */
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0)
  const [titles, setTitles] = useState<TTitle[]>([])
  const currentTitleText = titles.length ? titles[currentTitleIdx].label : ''

  const [headerHeight, setHeaderHeight] = useState(0)

  const ref = useRef<ScrollView>(null)
  const prevScrollPosition = useRef(0)
  const scrollY = useRef(new Animated.Value(0)).current

  /**
   * NOTE y position of the collapsible container is needed
   * to correctly calculate position of collapsible title(-s)
   */
  const [containerY, setContainerY] = useState(0)
  const collapsibleCloneRef = useRef<View>(null)
  useEffect(() => {
    collapsibleCloneRef.current?.measureInWindow((x, y, width, height) => {
      setContainerY(y)
    })
  }, [])

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
              // if it is not the last title
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

            // TODO: add functionality of handleSnap id the scroll stops somewhere
            // in the middle of title container.
          }
        }
      },
    },
  )

  const handleSnap = <T extends ScrollView | FlatList>(
    event: NativeSyntheticEvent<NativeScrollEvent>,
    passedRef?: React.RefObject<T>,
  ) => {
    /**
     * if reference to another scroll component was passed - using it instead,
     * to control snap from outside of Collapsible component
     */
    const list = passedRef?.current ? passedRef : ref

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
          } else if (isKeyboardAwareScroll(list)) {
            list.current.scrollToPosition(
              list.current.position.x,
              moveToY,
              true,
            )
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

  const handleHeaderContainerLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setHeaderHeight(height)
  }

  const contextValue = useMemo(
    () => ({
      // TODO: remove currentTitleText
      currentTitleText, // for Header
      scrollY, // for Title
      headerHeight, // for Title, Scroll
      onAddTitle: handleAddTitle, // for Title
      scrollRef: ref, // for Scroll,
      onScroll: handleScroll, // for Scroll,
      onSnap: handleSnap, // for Scroll,
      currentTitle: titles.length ? titles[currentTitleIdx] : undefined,
      containerY,
    }),
    [currentTitleText, headerHeight, currentTitleIdx],
  )

  return (
    <CollapsibleCloneContext.Provider value={contextValue}>
      <View ref={collapsibleCloneRef}>
        <View
          onLayout={handleHeaderContainerLayout}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          {renderHeader(currentTitleText, scrollY, headerHeight)}
        </View>
        {renderScroll(contextValue)}
        {children}
      </View>
    </CollapsibleCloneContext.Provider>
  )
}

CollapsibleClone.Title = Title
CollapsibleClone.Header = Header
CollapsibleClone.Scroll = Scroll
CollapsibleClone.KeyboardAwareScroll = KeyboardAwareScrollView
CollapsibleClone.Scale = Scale

export default CollapsibleClone
