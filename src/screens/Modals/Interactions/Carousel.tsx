import React from 'react'
import { ScrollView, Dimensions } from 'react-native'
import { CARD_WIDTH, CARD_HEIGHT } from './CredentialCard'

const Carousel: React.FC = ({ children }) => {
  return (
    <ScrollView
      directionalLockEnabled
      horizontal={true}
      decelerationRate={0}
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
