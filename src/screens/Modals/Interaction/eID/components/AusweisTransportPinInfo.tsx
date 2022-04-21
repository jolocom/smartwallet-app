import React from 'react'
import { View } from 'react-native'

import { PukImage } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import useTranslation from '~/hooks/useTranslation'

export const AusweisTransportPinInfo = () => {
  const { t } = useTranslation()

  return (
    <ScreenContainer
      hasHeaderBack
      backgroundColor={Colors.mainDark}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText kind={JoloTextKind.title} color={Colors.white85}>
        {t('AusweisTransportPinInfo.header')}
      </JoloText>
      <JoloText customStyles={{ textAlign: 'left', marginTop: 24 }}>
        {t('AusweisTransportPinInfo.description')}
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
