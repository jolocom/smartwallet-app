import React, { useEffect, useState, useRef } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
} from '~/components/Cards/consts'
import { StackScrollView } from '~/components/CardStack'
import ScreenContainer from '~/components/ScreenContainer'

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const VERTICAL_MARGIN = 12
const VISIBLE_HEADER = 40

interface CardProps {
  id: number | string
  index: number
  onPress: () => void
  isExpanded: boolean
}
const Card: React.FC<CardProps> = React.memo(
  ({ id, index, onPress, isExpanded, children }) => {
    useEffect(() => {
      console.log({ isExpanded })
    }, [isExpanded])
    const expandedMargin = -(
      ORIGINAL_DOCUMENT_CARD_HEIGHT -
      VERTICAL_MARGIN -
      VISIBLE_HEADER
    )
    const springConfig: Animated.WithSpringConfig = {
      damping: 15,
      mass: 1,
      stiffness: 200,
      velocity: 2,
    }

    const timingConfig = {
      duration: 200,
    }

    const animatedStyle = useAnimatedStyle(
      () => ({
        marginTop:
          index === 0
            ? withTiming(0, timingConfig)
            : isExpanded
            ? withTiming(0, timingConfig)
            : withSpring(expandedMargin, springConfig),
      }),
      [isExpanded],
    )

    return (
      <AnimatedTouchableOpacity
        onPress={onPress}
        activeOpacity={1}
        style={[
          {
            width: ORIGINAL_DOCUMENT_CARD_WIDTH,
            height: ORIGINAL_DOCUMENT_CARD_HEIGHT,
            borderRadius: 14,
            marginBottom: VERTICAL_MARGIN,
            zIndex: index,
          },
          animatedStyle,
        ]}
      >
        {children}
      </AnimatedTouchableOpacity>
    )
  },
  (prev, next) => prev.isExpanded === next.isExpanded,
)

interface StackScrollViewProps<T extends { id: string | number }> {
  data: Array<T>
  renderCard: (item: T, i: number) => React.ReactNode
}

//export const StackScrollView: React.FC<
//  StackScrollViewProps<{ id: string }>
//> = ({ data, renderCard }) => {
//  const [expandedId, setExpandedId] = useState<string | null>(null)
//
//  const handlePress = (id: string) => {
//    //scrollTo(scrollRef, 0, ORIGINAL_DOCUMENT_CARD_HEIGHT / 2, true)
//    //scrollRef.current.scrollTo({ x: 0, y: ORIGINAL_DOCUMENT_CARD_HEIGHT / 2 })
//    console.log('pressing', id)
//    setExpandedId(id)
//  }
//
//  const resetStack = () => {
//    setExpandedId(null)
//  }
//
//  const scrollHandler = useAnimatedScrollHandler(
//    {
//      onBeginDrag: (event) => {
//        if (expandedId) {
//          console.log(JSON.stringify(event, null, 2))
//          runOnJS(resetStack)()
//          //runOnJS(setExpandVelocity)(event.velocity?.y)
//        }
//      },
//    },
//    [expandedId],
//  )
//
//  return (
//    <Animated.ScrollView
//      onScroll={scrollHandler}
//      //ref={scrollRef}
//      scrollEventThrottle={4}
//      contentContainerStyle={{
//        paddingVertical: 40,
//        width: '100%',
//        paddingTop: 80,
//      }}
//    >
//      {data.map((n, i) => {
//        const nextId = data[i + 1] ? data[i + 1].id : false
//
//        return (
//          <Card
//            key={n.id}
//            id={n.id}
//            index={i}
//            onPress={() => handlePress(n.id)}
//            isExpanded={expandedId !== null ? n.id === data[i + 1].id : false}
//          >
//            {renderCard(n, i)}
//          </Card>
//        )
//      })}
//    </Animated.ScrollView>
//  )
//}

const CardStack = () => {
  //const scrollRef = useAnimatedRef<Animated.ScrollView>()

  return (
    <ScreenContainer>
      <StackScrollView
        data={[
          { stackId: '1', data: [{ id: '1' }, { id: '2' }, { id: '3' }] },
          { stackId: '2', data: [{ id: '1' }, { id: '2' }, { id: '3' }] },
        ]}
        renderStack={(data, Item) => {
          return (
            <View style={{ marginBottom: 40, width: '100%' }}>
              <Text>{data.stackId}</Text>
              {Item}
            </View>
          )
        }}
        renderItem={(data, i) => {
          return (
            <View
              style={{
                paddingTop: 100,
                backgroundColor: i % 2 ? 'red' : 'blue',
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Alert.alert('Pressed')
                }}
                style={{
                  width: 300,
                  height: 400,
                  backgroundColor: 'black',
                }}
              >
                <Text>{data.id}</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        itemHeight={400}
        visibleHeaderHeight={100}
        itemDistance={30}
      />
    </ScreenContainer>
  )
}

/*
 *
 * const expandedId = useSharedValue(null)
 *
 *
 *
 *
 */

export default CardStack
