import React from 'react'
import {
  Animated,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  StatusBar,
} from 'react-native'

import Header, { HeaderSizes } from '~/components/Header'
import { Colors } from '~/utils/colors'
import Paragraph, { ParagraphSizes } from './Paragraph'

interface Props {
  collapsedTitle: string
  animationStartPoint: number
  scrollAnimatedValue: Animated.Value
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const CollapsedScrollView: React.FC<Props> = ({
  children,
  collapsedTitle,
  scrollAnimatedValue,
  onScroll,
  animationStartPoint,
}) => {
  const interpolateScroll = (inputRange: number[], outputRange: number[]) =>
    scrollAnimatedValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  const headerOpacityValue = interpolateScroll(
    [animationStartPoint + 10, animationStartPoint + 15],
    [0, 1],
  )
  const headerTextValuePosition = interpolateScroll(
    [animationStartPoint, animationStartPoint + 50],
    [50, 0],
  )
  const headerTextOpacityValue = interpolateScroll(
    [animationStartPoint + 30, animationStartPoint + 40],
    [0, 1],
  )

  return (
    <>
      <Animated.View
        style={[styles.headerWrapper, { opacity: headerOpacityValue }]}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: headerTextValuePosition,
                },
              ],
              opacity: headerTextOpacityValue,
            },
          ]}
        >
          <Paragraph size={ParagraphSizes.large}>{collapsedTitle}</Paragraph>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        overScrollMode="never"
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollWrapper}
        scrollEventThrottle={1}
        onScroll={onScroll}
      >
        {children}
      </Animated.ScrollView>
    </>
  )
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0

const styles = StyleSheet.create({
  headerWrapper: {
    paddingTop: STATUS_BAR_HEIGHT,
    width: '100%',
    height: 62 + STATUS_BAR_HEIGHT,
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    // TODO @clauxx add shadows for ios
    elevation: 20,
    // HACK: @elevation won't work without @borderBottomWidth
    // https://github.com/timomeh/react-native-material-bottom-navigation/issues/8
    borderBottomWidth: 0,
    backgroundColor: Colors.mainBlack,
  },
  scrollWrapper: {
    paddingBottom: '30%',
  },
})

export default CollapsedScrollView
