import React, { useRef, useState } from 'react'
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
  Animated,
  ScrollView,
  StatusBar,
  Text,
} from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Title from '~/screens/LoggedIn/Settings/Development/CollapsibleClone/Title'
import { TTitle } from '~/screens/LoggedIn/Settings/Development/CollapsibleClone/types'
import { compare } from '~/screens/LoggedIn/Settings/Development/CollapsibleClone/utils'
import {
  TITLE_HEIGHT,
  HEADER_HEIGHT,
  TITLE_LABEL_1,
  TITLE_LABEL_2,
} from './consts'

const CollapsibleClone = () => {
  const [currentTitleIdx, setCurrentTitleIdx] = useState(0)
  const [titles, setTitles] = useState<TTitle[]>([])

  const ref = useRef<ScrollView>(null)
  const prevScrollPosition = useRef(0)
  const scrollY = useRef(new Animated.Value(0)).current
  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [HEADER_HEIGHT / 2, HEADER_HEIGHT],
    outputRange: [0, 1],
  })

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const { y } = event.nativeEvent.contentOffset
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
      },
    },
  )

  const handleSnap = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y
    const { startY, endY } = titles[currentTitleIdx]
    if (offsetY >= startY && offsetY <= endY) {
      if (ref.current) {
        ref.current.scrollTo({
          y: offsetY < startY + TITLE_HEIGHT / 2 ? startY : endY,
        })
      }
    }
  }

  const handleAddTitle = (title: TTitle) => {
    setTitles((prev) => [...prev, title].sort(compare))
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
      <StatusBar backgroundColor="pink" />
      <View style={styles.headerContainer}>
        <Text style={[styles.text, { flex: 0.2 }]}>Menu</Text>
        <Animated.Text
          numberOfLines={1}
          style={[styles.text, { flex: 0.5, opacity: headerTitleOpacity }]}
        >
          {titles.length ? titles[currentTitleIdx].label : ''}
        </Animated.Text>
        <Text style={[styles.text, { flex: 0.2 }]}>Close</Text>
      </View>
      <Animated.ScrollView
        ref={ref}
        contentContainerStyle={{ paddingTop: HEADER_HEIGHT }}
        style={{ width: '100%' }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onScrollEndDrag={handleSnap}
      >
        <Title text={TITLE_LABEL_1} onAddTitle={handleAddTitle} />
        {[...Array(5).keys()].map((i) => (
          <View style={styles.rect} />
        ))}
        <Title text={TITLE_LABEL_2} onAddTitle={handleAddTitle} />
        {[...Array(20).keys()].map((i) => (
          <View style={styles.rect} />
        ))}
      </Animated.ScrollView>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
    zIndex: 1,
    // children related
    paddingHorizontal: 10,
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: 'black',
  },
  text: {
    fontSize: 20,
    color: 'white',
  },
  rect: {
    width: '100%',
    height: 40,
    borderColor: 'purple',
    borderWidth: 2,
    paddingBottom: 20,
    backgroundColor: 'palegreen',
  },
})

export default CollapsibleClone
