import React from 'react'
import {
  Animated,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'

import Header, { HeaderSizes } from '../Header'
import { Colors } from '~/utils/colors'

interface Props {
  collapsedTitle: string
  scrollAnimatedValue: Animated.Value
  onScroll: (e: NativeSyntheticEvent<NativeScrollEvent>) => void
}

const CollapsedScrollView: React.FC<Props> = ({
  children,
  collapsedTitle,
  scrollAnimatedValue,
  onScroll,
}) => {
  const interpolateScroll = (inputRange: number[], outputRange: number[]) =>
    scrollAnimatedValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  const headerOpacityValue = interpolateScroll([0, 100], [0, 1])
  const headerTextValuePosition = interpolateScroll([120, 150], [30, 0])
  const headerTextOpacityValue = interpolateScroll([130, 150], [0, 1])

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
          <Header size={HeaderSizes.medium}>{collapsedTitle}</Header>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
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

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    height: 84,
    position: 'absolute',
    top: -30,
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
