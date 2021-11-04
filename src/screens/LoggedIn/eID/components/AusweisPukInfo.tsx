import React from 'react'
import { View } from 'react-native'

import { PukImage } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'

export const AusweisPukInfo: React.FC = () => {
  //NOTE: will be removed when translations are added. It's here so the newline (\n) is applied
  const description =
    'You will find the PUK number in the letter  you received from your responsible authority (marked in red) after you have applied for your identity card.\n\nPlease note that you can not use the online eID function with the five-digit Transport PIN. A change to a six-digit PIN is mandatory.'

  return (
    <ScreenContainer
      hasHeaderBack
      backgroundColor={Colors.mainDark}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText kind={JoloTextKind.title} color={Colors.white85}>
        PUK number info
      </JoloText>
      <JoloText customStyles={{ textAlign: 'left', marginTop: 24 }}>
        {description}
      </JoloText>
      <View
        style={{
          paddingHorizontal: BP({ default: 36, large: 72 }),
          marginTop: BP({ large: 80, default: 40 }),
          width: '100%',
        }}
      >
        <PukImage />
      </View>
    </ScreenContainer>
  )
}
