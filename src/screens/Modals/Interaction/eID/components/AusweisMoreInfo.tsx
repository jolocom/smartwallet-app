import React from 'react'
import { ScrollView } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'

export const AusweisMoreInfo = () => {
  const { t } = useTranslation()
  return (
    <ScreenContainer hasHeaderBack>
      <ScrollView
        style={{ width: '100%' }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <JoloText kind={JoloTextKind.title} customStyles={{ marginBottom: 24 }}>
          {t('AusweisIdentity.moreInfoHeader')}
        </JoloText>
        <JoloText
          customStyles={{
            textAlign: 'left',
            paddingBottom: 24,
          }}
        >
          {t('AusweisIdentity.moreInfoDescription')}
        </JoloText>
      </ScrollView>
    </ScreenContainer>
  )
}
