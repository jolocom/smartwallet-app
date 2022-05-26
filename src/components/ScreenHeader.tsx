import React from 'react'
import { View } from 'react-native'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

interface PropsI {
  title: string
  subtitle: string
}

const ScreenHeader: React.FC<PropsI> = ({ title, subtitle }) => {
  return (
    <View>
      <JoloText
        testID="title"
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        color={Colors.white85}
      >
        {title}
      </JoloText>
      <JoloText
        testID="subtitle"
        kind={JoloTextKind.subtitle}
        size={JoloTextSizes.middle}
        color={Colors.white70}
        customStyles={{ opacity: 0.8, paddingTop: 16 }}
      >
        {subtitle}
      </JoloText>
    </View>
  )
}

export default ScreenHeader
