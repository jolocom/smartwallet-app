import React from 'react'
import { Animated } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { useCollapsible } from '../context'

const ADDITIONAL_DISTANCE = 30

export const HeaderText: React.FC = ({ children }) => {
  const {
    interpolateYValue,
    distanceToTop,
    distanceToHeader,
  } = useCollapsible()

  const headerTextPositionValue = interpolateYValue(
    [distanceToHeader - ADDITIONAL_DISTANCE, distanceToTop],
    [30, 0],
  )

  const headerTextOpacityValue = interpolateYValue(
    [distanceToHeader - ADDITIONAL_DISTANCE, distanceToTop],
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
