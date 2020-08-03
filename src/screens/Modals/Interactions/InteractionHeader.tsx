import React from 'react'
import { View } from 'react-native'
import Header, { HeaderSizes } from '~/components/Header'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'

const InteractionHeader: React.FC = () => {
  return (
    <View>
      <Header size={HeaderSizes.medium} color={Colors.white90}>
        title
      </Header>
      <Paragraph size={ParagraphSizes.small} color={Colors.white90}>
        description
      </Paragraph>
    </View>
  )
}

export default InteractionHeader
