import React from 'react'
import { Animated, StyleSheet } from 'react-native'

import { Colors } from '~/utils/colors'
import CollapsedScrollView from '~/components/CollapsedScrollView'
import InteractionHeader from '~/screens/Modals/Interactions/InteractionHeader'
import InteractionFooter from '~/screens/Modals/Interactions/InteractionFooter'
import ScreenContainer from '~/components/ScreenContainer'
import useInteractionTitle from '~/screens/Modals/Interactions/hooks/useInteractionTitle'
import useScrollAnimation from '~/hooks/useScrollAnimation'

import useInteractionHeaderAnimation from './useInteractionHeaderAnimation'
import InteractionIcon, { IconWrapper } from './InteractionIcon'

const FasWrapper: React.FC<{ onSubmit: () => void }> = ({
  children,
  onSubmit,
}) => {
  const interactionTitle = useInteractionTitle()
  const { handleScroll, yPositionValue } = useScrollAnimation()
  const {
    animatedOpacityStyle,
    animatedScaleStyle,
  } = useInteractionHeaderAnimation(yPositionValue)

  return (
    <ScreenContainer isFullscreen>
      <CollapsedScrollView
        collapsedTitle={interactionTitle}
        scrollAnimatedValue={yPositionValue}
        onScroll={handleScroll}
      >
        <Animated.View style={animatedScaleStyle}>
          <IconWrapper customStyle={{ marginVertical: 12 }}>
            <InteractionIcon />
          </IconWrapper>
        </Animated.View>
        <InteractionHeader
          animatedTitleStyle={animatedScaleStyle}
          animatedDescriptionStyle={animatedOpacityStyle}
        />
        {children}
      </CollapsedScrollView>
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
