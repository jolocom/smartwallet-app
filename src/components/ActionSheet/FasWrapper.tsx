import React, { useRef } from 'react'
import { View, ScrollView, Animated, StyleSheet } from 'react-native'

import InteractionIcon, { IconWrapper } from './InteractionIcon'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import LinearGradient from 'react-native-linear-gradient'
import Header, { HeaderSizes } from '../Header'
import { Colors } from '~/utils/colors'
import ScreenContainer from '../ScreenContainer'
import { useSelector } from 'react-redux'
import { getInteractionSummary } from '~/modules/interaction/selectors'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import useInteractionTitle from '~/screens/Modals/Interactions/hooks/useInteractionTitle'

const FasWrapper: React.FC<{ onSubmit: () => void }> = ({
  children,
  onSubmit,
}) => {
  const interactionTitle = useInteractionTitle()
  const transY = useRef(new Animated.Value(0)).current
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: transY } },
      },
    ],
    { useNativeDriver: true },
  )

  const interpolateY = (inputRange: number[], outputRange: number[]) =>
    transY.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  // TODO @clauxx test and adjust values for small screens
  const headerOpacityValue = interpolateY([0, 100], [0, 1])
  const headerTextValueY = interpolateY([120, 150], [30, 0])
  const headerTextOpacityValue = interpolateY([130, 150], [0, 1])
  const detailsOpacityValue = interpolateY([0, 100], [1, 0])
  const profileScaleValue = interpolateY([0, 100], [1, 0.8])

  const gradientColors = ['rgb(245, 245, 245)', 'rgba(245, 245, 245, 0.72)']
  return (
    <ScreenContainer isFullscreen>
      <Animated.View
        style={[styles.headerWrapper, { opacity: headerOpacityValue }]}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: headerTextValueY,
                },
              ],
              opacity: headerTextOpacityValue,
            },
          ]}
        >
          <Header size={HeaderSizes.medium}>{interactionTitle}</Header>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollWrapper}
        scrollEventThrottle={1}
        onScroll={handleScroll}
      >
        <Animated.View
          style={[
            styles.profileWrapper,
            {
              transform: [
                { scaleY: profileScaleValue },
                { scaleX: profileScaleValue },
                { translateY: transY },
              ],
              opacity: detailsOpacityValue,
            },
          ]}
        >
          <IconWrapper customStyle={{ marginVertical: 12 }}>
            <InteractionIcon />
          </IconWrapper>
          <InteractionHeader />
        </Animated.View>
        {children}
      </Animated.ScrollView>
      <InteractionFooter onSubmit={onSubmit} />
    </ScreenContainer>
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
  gradientWrapper: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollWrapper: {
    paddingBottom: '30%',
  },
  profileWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
})

export default FasWrapper
