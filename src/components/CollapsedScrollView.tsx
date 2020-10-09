import React from 'react'
import { Animated, StyleSheet, StatusBar } from 'react-native'

import { Colors } from '~/utils/colors'
import useCollapsedScrollViewAnimations from '~/hooks/useScrollAnimation'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { INTERACTION_SHEET_PADDING } from '~/screens/Modals/Interactions/consts'
import { useSafeArea } from 'react-native-safe-area-context'

interface Props {
  collapsedTitle: string
  renderCollapsingComponent: () => React.ReactNode
  collapseStart: number
}

/**
 *  @ScrollView wrapper which collapses content into a header
 *
 *  @param collapsedTitle - text that should appear in the header after the content is collapsed
 *  @param renderCollapsingComponent - JSX that will be collapsed on scroll
 *  @param collapseStart - distance scrolled (dp) after which the content starts collapsing
 */

const CollapsedScrollView: React.FC<Props> = ({
  children,
  collapsedTitle,
  renderCollapsingComponent,
  collapseStart,
}) => {
  const {
    handleScroll,
    componentAnimatedValues: {
      componentScaleValue,
      componentOpacityValue,
      componentPositionValue,
    },
    headerAnimatedValues: {
      headerOpacityValue,
      headerTextOpacityValue,
      headerTextPositionValue,
    },
  } = useCollapsedScrollViewAnimations(collapseStart)

  const animatedScaleStyle = [
    {
      transform: [
        { scaleY: componentScaleValue },
        { scaleX: componentScaleValue },
        { translateY: componentPositionValue },
      ],
      opacity: componentOpacityValue,
    },
  ]

  const { top } = useSafeArea()
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.headerWrapper,

          {
            opacity: headerOpacityValue,
            height: 62 + top,
            paddingTop: top,
          },
        ]}
      >
        <Animated.View
          style={[
            {
              transform: [
                {
                  translateY: headerTextPositionValue,
                },
              ],
              opacity: headerTextOpacityValue,
            },
          ]}
        >
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.mini}
            weight={JoloTextWeight.regular}
            color={Colors.white}
          >
            {collapsedTitle}
          </JoloText>
        </Animated.View>
      </Animated.View>
      <Animated.ScrollView
        overScrollMode="never"
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollWrapper}
        scrollEventThrottle={1}
        onScroll={handleScroll}
      >
        <Animated.View style={animatedScaleStyle}>
          {renderCollapsingComponent()}
        </Animated.View>
        {children}
      </Animated.ScrollView>
    </>
  )
}

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 0

const styles = StyleSheet.create({
  headerWrapper: {
    width: '100%',
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
    elevation: 20,
    shadowColor: Colors.black65,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 11,
    shadowOpacity: 1,
    // HACK: @elevation won't work without @borderBottomWidth
    // https://github.com/timomeh/react-native-material-bottom-navigation/issues/8
    borderBottomWidth: 0,
    backgroundColor: Colors.mainBlack,
  },
  scrollWrapper: {
    paddingBottom: '30%',
    paddingHorizontal: INTERACTION_SHEET_PADDING,
  },
})

export default CollapsedScrollView
