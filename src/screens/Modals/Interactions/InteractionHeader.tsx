import React from 'react'
import { View } from 'react-native'
import Header, { HeaderSizes } from '~/components/Header'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import {
  getIntermediaryState,
  getInteractionCounterparty,
} from '~/modules/interaction/selectors'
import { useSelector } from 'react-redux'
import { Colors } from '~/utils/colors'
import { IntermediaryState } from '~/modules/interaction/types'
import useInteractionTitle from './hooks/useInteractionTitle'
import useInteractionDescription from './hooks/useInteractionDescription'

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
      <Header
        size={HeaderSizes.medium}
        color={Colors.white90}
        customStyles={{ lineHeight: 28 }}
      >
        {title || interactionTitle}
      </Header>
      <Paragraph
        size={ParagraphSizes.small}
        color={isAnonymous ? Colors.error : Colors.white90}
        customStyles={{
          paddingHorizontal: 16,
          marginTop: 14,
        }}
      >
        {description || interactionDescription}
      </Paragraph>
    </View>
  )
}

export default InteractionHeader
