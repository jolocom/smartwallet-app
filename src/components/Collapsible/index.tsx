import React, { useCallback, useMemo, useRef, useState } from 'react'
import {
  Animated,
  FlatList,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  View,
} from 'react-native'

import { CollapsibleContext } from './context'
import Header from './Header'
import KeyboardAwareScrollView from './KeyboardAwareScroll'
import Scale from './Scale'
import Scroll from './Scroll'
import Title from './Title'
import {
  ICollapsibleComposite,
  ICollapsibleContext,
  isFlatList,
  isKeyboardAwareScroll,
  isScrollView,
  TTitle,
} from './types'
import { compare } from './utils'

interface ICollapsible {
  renderHeader: (context: ICollapsibleContext) => React.ReactElement | null
  renderScroll: (context: ICollapsibleContext) => React.ReactElement | null
}

const Collapsible: React.FC<ICollapsible> & ICollapsibleComposite = ({
  renderHeader,
  renderScroll,
  children,
}) => {
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

  const collapsibleRef = useRef<View>(null)

  const handleScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
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

            // TODO: add functionality of handleSnap id the scroll stops somewhere
            // in the middle of title container.
          }
        }
      },
    }),
    [JSON.stringify(titles), currentTitleIdx],
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
          const moveToY = offsetY < (startY + endY) / 2 ? startY : endY
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
      collapsibleRef,
    }),
    [currentTitleText, headerHeight, currentTitleIdx, JSON.stringify(titles)],
  )

  return (
    <CollapsibleContext.Provider value={contextValue}>
      {/* NOTE: `collapsible` props makes sure that view is being drawn
       * https://reactnative.dev/docs/view#collapsable
       */}
      <View ref={collapsibleRef} collapsable={false}>
        <View
          testID="collapsible-header-container"
          onLayout={handleHeaderContainerLayout}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          {renderHeader(contextValue)}
        </View>
        {headerHeight !== 0 && (
          <>
            {renderScroll(contextValue)}
            {children}
          </>
        )}
      </View>
    </CollapsibleContext.Provider>
  )
}

Collapsible.Title = Title
Collapsible.Header = Header
Collapsible.Scroll = Scroll
Collapsible.KeyboardAwareScroll = KeyboardAwareScrollView
Collapsible.Scale = Scale

export default Collapsible
