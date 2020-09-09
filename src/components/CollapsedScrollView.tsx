import React from 'react'
import { Animated, StyleSheet, StatusBar } from 'react-native'

import { Colors } from '~/utils/colors'
import useCollapsedScrollViewAnimations from '~/hooks/useScrollAnimation'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'

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
                  translateY: headerTextPositionValue,
                },
              ],
              opacity: headerTextOpacityValue,
            },
          ]}
        >
          <JoloText
            kind={JoloTextKind.title}
            size="mini"
            weight={JoloTextWeight.normal}
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
    paddingTop: STATUS_BAR_HEIGHT,
    width: '100%',
    height: 62 + STATUS_BAR_HEIGHT,
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
  },
})

export default CollapsedScrollView
