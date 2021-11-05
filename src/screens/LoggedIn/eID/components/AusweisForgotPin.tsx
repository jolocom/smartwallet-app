import React from 'react'
import { Linking, TouchableOpacity } from 'react-native'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import useTranslation from '~/hooks/useTranslation'
import { Colors } from '~/utils/colors'

const AUSWEIS_SUPPORT_EMAIL = 'support@ausweissapp.de'
const AUSWEIS_SUPPORT_PHONE = '0421 204 95 995'

export const AusweisForgotPin = () => {
  const { t } = useTranslation()

  const handleSendEmail = () => {
    const url = `mailto:${AUSWEIS_SUPPORT_EMAIL}`
    Linking.openURL(url)
  }

  const handleOpenPhone = () => {
    const url = `tel:${AUSWEIS_SUPPORT_PHONE}`
    Linking.openURL(url)
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.mainDark}
      hasHeaderBack
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText
        kind={JoloTextKind.title}
        customStyles={{ paddingHorizontal: 28 }}
      >
        {t('AusweisLostPin.title')}
      </JoloText>
      <JoloText customStyles={{ marginTop: 24, paddingHorizontal: 18 }}>
        {t('AusweisLostPin.description')}
      </JoloText>
      <JoloText customStyles={{ marginTop: 32, paddingHorizontal: 18 }}>
        {t('AusweisLostPin.contact')}
      </JoloText>
      <TouchableOpacity onPress={handleSendEmail}>
        <JoloText color={Colors.success} customStyles={{ marginTop: 32 }}>
          {AUSWEIS_SUPPORT_EMAIL}
        </JoloText>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleOpenPhone}>
        <JoloText color={Colors.success} customStyles={{ marginTop: 12 }}>
          {AUSWEIS_SUPPORT_PHONE + ' (' + t('AusweisLostPin.phoneRate') + ')'}
        </JoloText>
      </TouchableOpacity>
    </ScreenContainer>
  )
}
