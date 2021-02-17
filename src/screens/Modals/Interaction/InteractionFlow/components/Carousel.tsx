import React from 'react'
import { ScrollView } from 'react-native'
import { CARD_WIDTH, SMALL_CARD_SCALE } from './CredentialCard'

const Carousel: React.FC = ({ children }) => {
  return (
    <ScrollView
      directionalLockEnabled
      horizontal={true}
      decelerationRate="fast"
      showsHorizontalScrollIndicator={false}
      //NOTE: 20 is the margin between the cards
      snapToInterval={CARD_WIDTH * SMALL_CARD_SCALE + 20}
      overScrollMode="never"
      contentContainerStyle={{
        alignItems: 'center',
        paddingRight: (CARD_WIDTH * SMALL_CARD_SCALE) / 4,
      }}
    >
      {children}
    </ScrollView>
  )
}

export default Carousel
