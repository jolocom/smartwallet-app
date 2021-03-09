import React from 'react'
import { Animated } from 'react-native'

import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { Colors } from '~/utils/colors'
import { useCollapsible } from '../context'

export const HeaderText: React.FC = ({ children }) => {
  const { interpolateYValue, distanceToText } = useCollapsible()

  const headerTextPositionValue = interpolateYValue(
    [distanceToText * 0.6, distanceToText * 0.8],
    [50, 0],
  )

  const headerTextOpacityValue = interpolateYValue(
    [distanceToText * 0.7, distanceToText * 0.8],
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
      >
        {children}
      </JoloText>
    </Animated.View>
  )
}
