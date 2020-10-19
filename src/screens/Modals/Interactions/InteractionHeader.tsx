import React from 'react'
import { useSelector } from 'react-redux'

import { getInteractionCounterparty } from '~/modules/interaction/selectors'
import { Colors } from '~/utils/colors'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import BP from '~/utils/breakpoints'
import { strings } from '~/translations/strings'
import truncateDid from '~/utils/truncateDid'
import { StyleSheet, View } from 'react-native'

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
    <View style={styles.container}>
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        color={Colors.white90}
        customStyles={{
          lineHeight: BP({ xsmall: 24, default: 28 }),
          marginBottom: BP({ default: 4, medium: 8, large: 8 }),
        }}
      >
        {title}
      </JoloText>
      <JoloText
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.mini}
        color={isAnonymous ? Colors.error : Colors.white70}
        customStyles={{ paddingHorizontal: 20 }}
      >
        {description}
      </JoloText>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 40,
  },
})

export default InteractionHeader
