import React from 'react'
import { ScrollView } from 'react-native'
import { CARD_WIDTH, CARD_HEIGHT } from './CredentialCard'

const Carousel: React.FC = ({ children }) => {
  return (
    <ScrollView
      directionalLockEnabled
      horizontal={true}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH - 30}
      contentContainerStyle={{
        height: CARD_HEIGHT,
        alignItems: 'center',
      }}
    >
      {children}
    </ScrollView>
  )
}

export default Carousel
