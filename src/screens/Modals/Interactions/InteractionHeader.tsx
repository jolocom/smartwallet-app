import React from 'react'
import { View } from 'react-native'
import {
  getIntermediaryState,
  getInteractionCounterparty,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionTitle from './hooks/useInteractionTitle'
import useInteractionDescription from './hooks/useInteractionDescription'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

interface PropsI {
  title?: string
  description?: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const counterparty = useSelector(getInteractionCounterparty)
  const intermediaryState = useSelector(getIntermediaryState)
  const interactionTitle = useInteractionTitle()
  const interactionDescription = useInteractionDescription()
  const isAnonymous =
    intermediaryState === IntermediaryState.showing
      ? false
      : !counterparty?.publicProfile

  return (
    <View>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
      >
        {title || interactionTitle}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={isAnonymous ? Colors.error : Colors.white70}
        customStyles={{
          paddingHorizontal: 16,
          marginTop: 14,
        }}
      >
        {description || interactionDescription}
      </JoloText>
    </View>
  )
}

export default InteractionHeader
