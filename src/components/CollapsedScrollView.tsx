import React from 'react'
import { Animated, StyleSheet, StatusBar } from 'react-native'

import { Colors } from '~/utils/colors'
import Paragraph, { ParagraphSizes } from './Paragraph'
import useCollapsedScrollViewAnimations from '~/hooks/useScrollAnimation'

interface Props {
  collapsedTitle: string
  renderCollapsingComponent: () => React.ReactNode
  animationStartPoint: number
}

const CollapsedScrollView: React.FC<Props> = ({
  children,
  collapsedTitle,
  renderCollapsingComponent,
  animationStartPoint,
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
  } = useCollapsedScrollViewAnimations(animationStartPoint)

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
          <Paragraph size={ParagraphSizes.large}>{collapsedTitle}</Paragraph>
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
