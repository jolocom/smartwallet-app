import React from 'react'
import { View } from 'react-native'
import { AusweisCanInfoCard } from '~/assets/svg'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'

export const AusweisCanInfo = () => {
  const { t } = useTranslation()

  return (
    <ScreenContainer
      hasHeaderBack
      backgroundColor={Colors.mainDark}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText kind={JoloTextKind.title}>
        {t('AusweisCanInfo.header')}
      </JoloText>
      <JoloText customStyles={{ marginTop: 24, textAlign: 'left' }}>
        {t('AusweisCanInfo.description')}
      </JoloText>
      <View style={{ width: '100%', aspectRatio: 358 / 203, marginTop: 36 }}>
        <AusweisCanInfoCard />
      </View>
    </ScreenContainer>
  )
}
