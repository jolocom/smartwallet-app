import React from 'react'
import { View } from 'react-native'
import { useSelector } from 'react-redux'

import { getInteractionCounterparty } from '~/modules/interaction/selectors'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { strings } from '~/translations/strings'
import truncateDid from '~/utils/truncateDid'

interface PropsI {
  title: string
  description: string
}

const InteractionHeader: React.FC<PropsI> = ({ title, description }) => {
  const counterparty = useSelector(getInteractionCounterparty)
  const isAnonymous = !counterparty?.publicProfile

  if (isAnonymous) {
    description = strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS(
      truncateDid(counterparty.did),
    )
  }

  return (
    <View>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
      >
        {title}
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
        {description}
      </JoloText>
    </View>
  )
}

export default InteractionHeader
