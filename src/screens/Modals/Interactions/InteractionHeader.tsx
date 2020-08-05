import React from 'react'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { InteractionSummary } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import {
  getInteractionSummary,
  getIntermediaryState,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionTitle from './hooks/useInteractionTitle'
import useInteractionDescription from './hooks/useInteractionDescription'
import { Animated, StyleProp, ViewStyle } from 'react-native'

interface PropsI {
  title?: string
  description?: string
  animatedTitleStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>
  animatedDescriptionStyle?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>
}

const InteractionHeader: React.FC<PropsI> = ({
  title,
  description,
  animatedTitleStyle = {},
  animatedDescriptionStyle = {},
}) => {
  const summary: InteractionSummary = useSelector(getInteractionSummary)
  const intermediaryState = useSelector(getIntermediaryState)
  const interactionTitle = useInteractionTitle()
  const interactionDescription = useInteractionDescription()
  //NOTE: this is getting ugly b/c of the intermediary screen
  const isAnonymous =
    intermediaryState === IntermediaryState.showing
      ? false
      : !summary.initiator?.publicProfile

  //TODO: @clauxx add strings
  return (
    <>
      <Animated.View style={animatedTitleStyle}>
        <Header size={HeaderSizes.medium} color={Colors.white90}>
          {title || interactionTitle}
        </Header>
      </Animated.View>
      <Animated.View style={animatedDescriptionStyle}>
        <Paragraph
          size={ParagraphSizes.small}
          color={isAnonymous ? Colors.error : Colors.white90}
          customStyles={{
            paddingHorizontal: 16,
            marginTop: 8,
            marginBottom: 36,
          }}
        >
          {description || interactionDescription}
        </Paragraph>
      </Animated.View>
    </>
  )
}

export default InteractionHeader
