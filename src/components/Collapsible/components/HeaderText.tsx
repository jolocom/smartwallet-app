import React from 'react'
import { Animated } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { useCollapsible } from '../context'

export const HeaderText: React.FC = ({ children }) => {
  const {
    interpolateYValue,
    distanceToTop,
    distanceToHeader,
    hidingTextHeight,
  } = useCollapsible()

  const hidingTextFraction = hidingTextHeight * 0.7

  const headerTextPositionValue = interpolateYValue(
    [distanceToHeader - hidingTextFraction, distanceToTop - 70],
    [30, 0],
  )

  const headerTextOpacityValue = interpolateYValue(
    [distanceToHeader - hidingTextFraction, distanceToTop - 70],
    [0, 1],
  )

  return (
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
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.big}
        weight={JoloTextWeight.regular}
        color={Colors.white}
        numberOfLines={1}
      >
        {children}
      </JoloText>
    </Animated.View>
  )
}
